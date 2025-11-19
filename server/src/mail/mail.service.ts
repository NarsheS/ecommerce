// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // use env vars or inject config
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerification(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify?token=${encodeURIComponent(token)}`;
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Please verify your email',
      html: `Click <a href="${url}">here</a> to verify your account.`,
    });
  }

  async sendReset(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Password reset',
      html: `Reset your password by clicking <a href="${url}">${url}</a>`,
    });
  }
}
