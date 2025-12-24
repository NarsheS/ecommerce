// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Enviar verificação de conta
  async sendVerification(email: string, token: string) {
    const url = `${process.env.APP_URL}/verify?token=${token}`;

    try {
      const result = await this.resend.emails.send({
        from: `"Loja" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Verifique seu email',
        html: `
          <h2>Verifique sua conta</h2>
          <p>Clique no link abaixo para confirmar a sua conta:</p>
          <a href="${url}">
            <button style="padding:10px 16px; background:#000; color:#fff; border:none; cursor:pointer">
              Clique aqui!
            </button>
          </a>
        `,
      });

      this.logger.log(`Email de verificação enviado para ${email}`);
      return result;
    } catch (err) {
      this.logger.error('EMAIL ERROR (verification)', err);
      throw new Error('Falha ao enviar verificação de email');
    }
  }

  // Redefinir senha
  async sendReset(email: string, token: string) {
    const url = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

    try {
      const result = await this.resend.emails.send({
        from: `"Loja" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Requisição de redefinição de senha',
        html: `
          <h2>Redefinição de senha</h2>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${url}">
            <button style="padding:10px 16px; background:#000; color:#fff; border:none; cursor:pointer">
              Clique aqui!
            </button>
          </a>
          <br><br>
          <p>Se não foi você, por favor ignore este email.</p>
        `,
      });

      this.logger.log(`Email de reset enviado para ${email}`);
      return result;
    } catch (err) {
      this.logger.error('EMAIL ERROR (reset)', err);
      throw new Error('Falha ao enviar email de redefinição de senha');
    }
  }
}
