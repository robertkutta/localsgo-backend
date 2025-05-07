import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY') || '';
    sendgrid.setApiKey(apiKey);
  }

  async sendNotification(
    to: string,
    itineraryName: string,
    reason: string,
    details?: string,
  ): Promise<void> {
    const fromEmail =
      this.configService.get<string>('SENDGRID_EMAIL_FROM') || '';

    const msg: sendgrid.MailDataRequired = {
      to,
      from: fromEmail,
      subject: `Your itinerary "${itineraryName}" has been reported`,
      html: `
        <p>An issue has been reported with your itinerary "${itineraryName}".</p>
        <p><strong>Reason:</strong> ${reason}</p>
        ${details ? `<p><strong>Details:</strong> ${details}</p>` : ''}
        <p>Please check your itinerary to make changes.</p>
      `,
    };

    try {
      await sendgrid.send(msg);
    } catch (error) {
      console.error('SendGrid Error:', error);
      if (error.response) {
        console.error('Error response:', error.response.body);
      }
      throw new Error('Failed to send email');
    }
  }
}
