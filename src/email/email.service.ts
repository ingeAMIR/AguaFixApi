import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.MAIL_HOST,
      port: envs.MAIL_PORT,
      secure: envs.MAIL_PORT === 465,
      auth:
        envs.MAIL_USER && envs.MAIL_PASSWORD
          ? {
              user: envs.MAIL_USER,
              pass: envs.MAIL_PASSWORD,
            }
          : undefined,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
  ): Promise<void> {
    try {
      const info = (await this.transporter.sendMail({
        from: envs.MAIL_FROM,
        to,
        subject,
        html: template,
      })) as { messageId?: string };
      const messageId = info?.messageId || 'enviado';
      this.logger.log(
        `Correo enviado exitosamente a: ${to} (MessageId: ${messageId})`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al enviar correo a ${to}: ${errorMessage}`);
    }
  }
}
