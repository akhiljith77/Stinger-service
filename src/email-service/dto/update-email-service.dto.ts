import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailServiceDto } from './create-email-service.dto';

export class UpdateEmailServiceDto extends PartialType(CreateEmailServiceDto) {}
