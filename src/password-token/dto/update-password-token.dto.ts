import { PartialType } from '@nestjs/mapped-types';
import { CreatePasswordTokenDto } from './create-password-token.dto';

export class UpdatePasswordTokenDto extends PartialType(
  CreatePasswordTokenDto,
) {}
