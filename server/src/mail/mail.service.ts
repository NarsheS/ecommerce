import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter, // nodemailer
  ) {}

  // Enviar verificação de conta ao usuário
  async sendVerification(email: string, token: string) {
    try {
      const url = `http://localhost:3000/auth/verify?token=${token}`;

      // Esse é o email que vai ser enviado
      return await this.transporter.sendMail({
        from: `"Loja" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Verifique seu email',
        html: `
          <h2>Verifique sua conta</h2>
          <p>Clique no link abaixo para confirmar a sua conta:</p>
          <a href="${url}"><button>Clique aqui!</button></a>
        `,
      });
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      throw new Error('Falha ao enviar verificação de email');
    }
  }

  // Redefinir senha
  async sendReset(email: string, token: string) {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;

    return await this.transporter.sendMail({
      from: `"Loja" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Requisição de redefinição de senha',
      html: `
        <h2>Redefinição de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${url}"><button>Clique aqui!</button></a>
        <br><br>
        <p>Se não foi você, por favor ignore este email.</p>
      `,
    });
  }
}
