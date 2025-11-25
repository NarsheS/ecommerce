import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {}

  async sendVerification(email: string, token: string) {
    try {
      const url = `http://localhost:3000/auth/verify?token=${token}`;

      return await this.transporter.sendMail({
        from: `"My Store" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Verify your email',
        html: `
          <h2>Verify your account</h2>
          <p>Click the link below to activate your account:</p>
          <a href="${url}">${url}</a>
        `,
      });
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      throw new Error('Failed to send verification email');
    }
  }


  async sendReset(email: string, token: string) {
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;

    return await this.transporter.sendMail({
      from: `"My Store" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Password reset request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${url}">${url}</a>
        <br><br>
        <p>If you did not request this, ignore the email.</p>
      `,
    });
  }
}
