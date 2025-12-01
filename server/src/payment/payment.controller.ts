import { Controller, Param, Post, Body, Req, Headers } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create/:orderId')
  createPayment(@Param('orderId') orderId: number) {
    return this.paymentService.createPayment(orderId);
  }

  // Stripe webhook
  @Post('webhook')
  async webhook(
    @Req() req,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody; // IMPORTANTE: precisa habilitar raw body no main.ts

    await this.paymentService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
