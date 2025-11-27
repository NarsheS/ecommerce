import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Order } from 'src/order/order.entity';

@Injectable()
export class PaymentService {
  private client: MercadoPagoConfig;

  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createPayment(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new Error('Order not found');

    const preference = new Preference(this.client);

    const preferenceData = await preference.create({
      body: {
        items: order.items.map(item => ({
          title: item.product.name,
          quantity: item.quantity,
          currency_id: "BRL",
          unit_price: Number(item.price),
        })),

        external_reference: String(order.id),

        back_urls: {
          success: "https://seu-frontend.com/success",
          failure: "https://seu-frontend.com/failure",
          pending: "https://seu-frontend.com/pending",
        },

        notification_url:
          "https://seu-backend.com/orders/webhook", // IMPORTANTE (exige HTTPS)
      },
    });

    return {
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point,
    };
  }

  async handleWebhook(data: any) {
    if (data.type !== "payment") return;

    const paymentId = data.data.id;

    // obter pagamento via API do Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    );

    const payment = await response.json();

    const orderId = Number(payment.external_reference);
    const status = payment.status;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) return;

    if (status === "approved") {
      order.status = 'paid';
    } else if (status === "cancelled" || status === "rejected") {
      order.status = 'cancelled';
    }

    await this.orderRepo.save(order);

    return true;
  }
}
