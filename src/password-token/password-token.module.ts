import { Module } from '@nestjs/common';
import { PasswordTokenService } from './password-token.service';
import { PasswordTokenController } from './password-token.controller';

@Module({
  controllers: [PasswordTokenController],
  providers: [PasswordTokenService],
})
export class PasswordTokenModule {}
