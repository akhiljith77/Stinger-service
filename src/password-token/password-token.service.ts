import { Injectable } from '@nestjs/common';
import { CreatePasswordTokenDto } from './dto/create-password-token.dto';
import { UpdatePasswordTokenDto } from './dto/update-password-token.dto';

@Injectable()
export class PasswordTokenService {
  create(createPasswordTokenDto: CreatePasswordTokenDto) {
    return 'This action adds a new passwordToken';
  }

  findAll() {
    return `This action returns all passwordToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordToken`;
  }

  update(id: number, updatePasswordTokenDto: UpdatePasswordTokenDto) {
    return `This action updates a #${id} passwordToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordToken`;
  }
}
