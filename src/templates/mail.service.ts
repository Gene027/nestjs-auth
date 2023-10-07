import { Injectable, Logger } from '@nestjs/common';
import * as postmark from 'postmark';
import { USER_TYPE } from '@src/common/enums';
import { env } from '@src/common/utils';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly mailerService: postmark.Client;
  constructor() {
    this.mailerService = new postmark.Client(env.POSTMARK_APIKEY || '');
  }

  async sendAccountVerificatonOtp(email: string, otp: string): Promise<void> {
    try {
      const response = await this.mailerService.sendEmail({
        From: env.FROM_EMAIL || 'services@onedrug.co',
        To: email,
        Subject: 'Welcome to OneDrug. Verify your account',
        HtmlBody: otp,
      });
      console.log('Email sent:', response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendPasswordResetLink(
    email: string,
    token: string,
    userType: USER_TYPE,
    callbackUrl?: string,
  ): Promise<void> {
    const url = `${callbackUrl || env.DEFAULT_APP_URL}/auth/reset-password/${
      userType === USER_TYPE.HEALTH_PROVIDER ? 'health-provider' : 'patient'
    }?token=${token}`;
    await this.mailerService.sendEmail({
      From: env.FROM_EMAIL || 'services@onedrug.co',
      To: email,
      Subject: 'Welcome to OneDrug. Password reset',
      HtmlBody: `Follow this link ${url} to reset your password`,
    });
  }

  async sendAccountVerificationLink(
    email: string,
    token: string,
    userType: USER_TYPE,
    callbackUrl?: string,
  ): Promise<void> {
    const url = `${callbackUrl || env.DEFAULT_APP_URL}/auth/verify-account/${
      userType === USER_TYPE.HEALTH_PROVIDER ? 'health-provider' : 'patient'
    }?token=${token}`;
    await this.mailerService.sendEmail({
      From: env.FROM_EMAIL || 'services@onedrug.co',
      To: email,
      Subject: 'Welcome to OneDrug. Password reset',
      HtmlBody: `Follow this link ${url} to verify your account`,
    });
  }
}
