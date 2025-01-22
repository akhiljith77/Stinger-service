import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordtokenService } from './passwordtoken.service';
import { CreatePasswordtokenDto } from './dto/create-passwordtoken.dto';
import { UpdatePasswordtokenDto } from './dto/update-passwordtoken.dto';

@Controller('passwordtoken')
export class PasswordtokenController {
  constructor(private readonly passwordtokenService: PasswordtokenService) {}

  @Post()
  create(@Body() createPasswordtokenDto: CreatePasswordtokenDto) {
    return this.passwordtokenService.create(createPasswordtokenDto);
  }

  @Get()
  findAll() {
    return this.passwordtokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordtokenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePasswordtokenDto: UpdatePasswordtokenDto) {
    return this.passwordtokenService.update(+id, updatePasswordtokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordtokenService.remove(+id);
  }
}
