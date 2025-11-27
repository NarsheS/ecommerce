import { Controller, Param, Post, Body, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // FRONT chama isso após criar o pedido
  @Post('create/:orderId')
  createPayment(@Param('orderId') orderId: number) {
    return this.paymentService.createPayment(orderId);
  }

  // Mercado Pago envia notificações aqui
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    await this.paymentService.handleWebhook(body);
    return { status: 'ok' };
  }
}
