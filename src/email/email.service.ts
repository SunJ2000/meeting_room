import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    const options = {
      host: this.configService.get<string>('nodemailer_host'),
      port: this.configService.get<number>('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('nodemailer_auth_user'),
        pass: this.configService.get<string>('nodemailer_auth_pass'),
      },
    };
    this.transporter = createTransport(options);
  }

  async sendMail({ to, subject, html }: MailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('nodemailer_auth_user') as string,
      },
      to,
      subject,
      html,
    });
  }
}
