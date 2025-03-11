import { Controller } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';

@Controller('email-service')
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailServiceService) {}
}
