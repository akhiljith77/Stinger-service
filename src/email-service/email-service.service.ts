import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class EmailServiceService {
  private twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }
}
