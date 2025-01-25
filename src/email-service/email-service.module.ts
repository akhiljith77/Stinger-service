import { Module } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { EmailServiceController } from './email-service.controller';

@Module({
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
})
export class EmailServiceModule {}
