import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

@Module({
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: async () => {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
          secure: false,
          tls: {
            rejectUnauthorized: false,
          }
        });

        // ADD THIS:
        transporter.verify((error, success) => {
          if (error) {
            console.error("SMTP ERROR:", error);
          } else {
            console.log("SMTP READY");
          }
        });

        return transporter;
      },
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
