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

@Injectable()
export class PaymentService implements OnModuleInit {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
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
    // Verifica se existe uma order
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new BadRequestException('Order not found');
    if (!order.items?.length)
      throw new BadRequestException('Order has no items');

    const frontUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontUrl) throw new Error('FRONTEND_URL is missing');

    // Converte items para formato Stripe
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

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${frontUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontUrl}/cancel`,
      metadata: {
        orderId: String(order.id),
      },
    });

    // Salva sessionId no DB por segurança
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
    if (!endpointSecret) throw new Error('STRIPE_WEBHOOK_SECRET is missing');

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

    // Processa event
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handlePaymentCompleted(event);
        break;

      default:
        this.logger.debug(`Unhandled Stripe event: ${event.type}`);
        break;
    }

    return true;
  }


  // Processa pagamento bem-sucedido
  private async handlePaymentCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = Number(session.metadata?.orderId);
    if (!orderId) {
      this.logger.error('Missing orderId in Stripe session metadata');
      return;
    }

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      return;
    }

    // Evita processar a mesma order 2x
    if (order.status === OrderStatus.PAID) {
      this.logger.warn(`Order ${orderId} already marked as paid`);
      return;
    }

    // Opcional: Validar moeda
    if (session.currency !== 'brl') {
      this.logger.error(
        `Invalid currency for order ${orderId}: expected BRL but got ${session.currency}`,
      );
      return;
    }

    // Opcional: validar montante recebido vs esperado
    // (Stripe retorna o total (montante final) em centavos)
    if (session.amount_total && order.total) {
      const expected = Math.round(order.total * 100);
      if (session.amount_total !== expected) {
        this.logger.error(
          `Payment mismatch on order ${orderId}. Expected ${expected}, got ${session.amount_total}`,
        );
        return;
      }
    }

    order.status = OrderStatus.PAID;
    order.stripeSessionId = session.id;
    await this.orderRepo.save(order);

    this.logger.log(`Order ${orderId} successfully marked as PAID`);
  }
}
