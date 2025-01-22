import { Module } from '@nestjs/common';
import { PasswordtokenService } from './passwordtoken.service';
import { PasswordtokenController } from './passwordtoken.controller';

@Module({
  controllers: [PasswordtokenController],
  providers: [PasswordtokenService],
})
export class PasswordtokenModule {}
