// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private logger = new Logger(MailService.name);

  constructor() {
    this.logger.log('Inicializando MailService');

    if (!process.env.RESEND_API_KEY) {
      this.logger.error('RESEND_API_KEY NÃO DEFINIDA');
    } else {
      this.logger.log(
        `RESEND_API_KEY carregada: ${process.env.RESEND_API_KEY.slice(0, 6)}***`,
      );
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Enviar verificação de conta
  async sendVerification(email: string, token: string) {
    this.logger.log(`sendVerification chamado para: ${email}`);

    const appUrl = process.env.APP_URL;
    const mailFrom = process.env.MAIL_FROM;

    this.logger.log(`APP_URL: ${appUrl}`);
    this.logger.log(`MAIL_FROM: ${mailFrom}`);

    if (!appUrl || !mailFrom) {
      this.logger.error('APP_URL ou MAIL_FROM não definidos');
      throw new Error('Configuração de email inválida');
    }

    const url = `${appUrl}/verify?token=${token}`;
    this.logger.log(`URL de verificação gerada: ${url}`);

    try {
      this.logger.log('Tentando enviar email via Resend...');

      const result = await this.resend.emails.send({
        from: `"Loja" <${mailFrom}>`,
        to: [email],
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

      this.logger.log(
        `Email de verificação enviado com sucesso. ID: ${result?.data?.id}`,
      );

      return result;
    } catch (err: any) {
      this.logger.error('EMAIL ERROR (verification)');
      this.logger.error(err?.message);
      this.logger.error(err?.response || err);
      throw err;
    }
  }

  // Redefinir senha
  async sendReset(email: string, token: string) {
    this.logger.log(`sendReset chamado para: ${email}`);

    const appUrl = process.env.APP_URL;
    const mailFrom = process.env.MAIL_FROM;

    if (!appUrl || !mailFrom) {
      this.logger.error('APP_URL ou MAIL_FROM não definidos');
      throw new Error('Configuração de email inválida');
    }

    const url = `${appUrl}/reset-password?token=${token}`;
    this.logger.log(`URL de reset gerada: ${url}`);

    try {
      this.logger.log('Tentando enviar email de reset via Resend...');

      const result = await this.resend.emails.send({
        from: `"Loja" <${mailFrom}>`,
        to: [email],
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

      this.logger.log(
        `Email de reset enviado com sucesso. ID: ${result?.data?.id}`,
      );

      return result;
    } catch (err: any) {
      this.logger.error('EMAIL ERROR (reset)');
      this.logger.error(err?.message);
      this.logger.error(err?.response || err);
      throw err;
    }
  }
}
