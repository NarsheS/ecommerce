import {
  Injectable,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from '../order/order.entity';
import { Products } from '../products/products.entity';

@Injectable()
export class PaymentService implements OnModuleInit {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,

    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  // CREATE - Stripe Checkout Session
  async createPayment(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new BadRequestException('Order not found');
    if (!order.items?.length)
      throw new BadRequestException('Order has no items');

    const frontUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontUrl) throw new Error('FRONTEND_URL is missing');

    // Validação do frete
    if (order.shippingCost == null || order.shippingCost < 0) {
      throw new BadRequestException('Invalid shipping cost');
    }

    // Produtos
    const line_items = order.items.map((item) => {
      const amount = item.finalPrice ?? item.price;

      if (amount <= 0) {
        throw new BadRequestException(
          `Invalid price for product ${item.product.id}`,
        );
      }

      return {
        price_data: {
          currency: 'brl',
          product_data: { name: item.product.name },
          unit_amount: Math.round(Number(amount) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Frete (somente se > 0)
    if (order.shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'brl',
          product_data: { name: 'Frete' },
          unit_amount: Math.round(Number(order.shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${frontUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontUrl}/cancel`,
      metadata: {
        orderId: String(order.id),
      },
      payment_intent_data: {
        metadata: {
          orderId: String(order.id),
        },
      },
    });

    // Salva sessionId
    order.stripeSessionId = session.id;
    await this.orderRepo.save(order);

    this.logger.log(`Stripe session created for order ${orderId}`);

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  // Stripe Webhook Handler
  async handleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!endpointSecret)
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error(
        'Invalid Stripe webhook signature: ' + err.message,
        err.stack,
      );
      throw new BadRequestException('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event);
        break;

      case 'checkout.session.expired':
        await this.handlePaymentExpired(event);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event);
        break;

      default:
        this.logger.debug(`Unhandled Stripe event: ${event.type}`);
    }

    return true;
  }

  private async handlePaymentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.error('Missing orderId in metadata');
      return;
    }

    const order = await this.orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      return;
    }

    if (order.status === OrderStatus.PAID) {
      this.logger.warn(`Order ${orderId} already PAID`);
      return;
    }

    // NÃO mexe em estoque
    order.status = OrderStatus.PAID;

    await this.orderRepo.save(order);

    this.logger.log(`Payment confirmed for order ${orderId}`);
  }

  private async handlePaymentExpired(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = Number(session.metadata?.orderId);
    if (!orderId) return;

    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) return;
    if (order.status === OrderStatus.PAID) return;

    // devolve estoque
    await this.restoreStock(order);

    order.status = OrderStatus.CANCELLED;

    await this.orderRepo.save(order);

    this.logger.log(`Order ${orderId} expired and stock restored`);
  }

  private async handlePaymentFailed(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.error('Missing orderId in metadata');
      return;
    }

    const order = await this.orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      return;
    }

    if (order.status === OrderStatus.PAID) {
      this.logger.warn(`Order ${orderId} already paid`);
      return;
    }

    // devolve estoque
    await this.restoreStock(order);

    order.status = OrderStatus.CANCELLED;

    await this.orderRepo.save(order);

    this.logger.warn(`Payment failed for order ${orderId}`);
  }

  private async restoreStock(order: Order) {
    for (const item of order.items) {
      item.product.inStock += item.quantity;
      await this.productRepo.save(item.product);
    }
  }
}