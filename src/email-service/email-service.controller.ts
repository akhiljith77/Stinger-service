import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailServiceService } from './email-service.service';
import { CreateEmailServiceDto } from './dto/create-email-service.dto';
import { UpdateEmailServiceDto } from './dto/update-email-service.dto';

@Controller('email-service')
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailServiceService) {}

  
}
