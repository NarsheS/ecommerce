import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from 'src/order/order.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY is missing");

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover', // recomendado caso Stripe dê aviso
    });
  }

  // ================================================================
  // CREATE PAYMENT (Checkout Session)
  // ================================================================
  async createPayment(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new BadRequestException('Order not found');
    if (!order.items || order.items.length === 0)
      throw new BadRequestException('Order has no items');

    // Check items
    const line_items = order.items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(Number(item.price) * 100), // em centavos
      },
      quantity: item.quantity,
    }));

    // Criar sessão de pagamento Stripe
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,

      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,

      metadata: {
        orderId: String(order.id),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  // ================================================================
  // HANDLE WEBHOOK
  // ================================================================
  async handleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) throw new Error("STRIPE_WEBHOOK_SECRET missing");

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error('❌ Invalid Stripe webhook signature:', err.message);
      throw new BadRequestException('Webhook signature validation failed');
    }

    // ✔ Evento de pagamento concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata?.orderId) {
        console.error("❌ orderId missing in session metadata");
        return true;
      }

      const orderId = Number(session.metadata.orderId);
      const order = await this.orderRepo.findOne({ where: { id: orderId } });

      if (!order) {
        console.error(`❌ Order ${orderId} not found`);
        return true;
      }

      order.status = OrderStatus.PAID;
      await this.orderRepo.save(order);

      console.log(`✅ Order ${orderId} marked as PAID`);
    }

    return true;
  }
}
