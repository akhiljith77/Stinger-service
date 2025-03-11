import {
  Controller,
} from '@nestjs/common';
import { PasswordTokenService } from './password-token.service';
import { CreatePasswordTokenDto } from './dto/create-password-token.dto';
import { UpdatePasswordTokenDto } from './dto/update-password-token.dto';

@Controller('password-token')
export class PasswordTokenController {
  constructor(private readonly passwordTokenService: PasswordTokenService) {}
}
