import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordTokenService } from './password-token.service';
import { CreatePasswordTokenDto } from './dto/create-password-token.dto';
import { UpdatePasswordTokenDto } from './dto/update-password-token.dto';

@Controller('password-token')
export class PasswordTokenController {
  constructor(private readonly passwordTokenService: PasswordTokenService) {}

  @Post()
  create(@Body() createPasswordTokenDto: CreatePasswordTokenDto) {
    return this.passwordTokenService.create(createPasswordTokenDto);
  }

  @Get()
  findAll() {
    return this.passwordTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordTokenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePasswordTokenDto: UpdatePasswordTokenDto) {
    return this.passwordTokenService.update(+id, updatePasswordTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordTokenService.remove(+id);
  }
}
