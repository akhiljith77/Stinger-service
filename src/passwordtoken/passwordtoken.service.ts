import { Injectable } from '@nestjs/common';
import { CreatePasswordtokenDto } from './dto/create-passwordtoken.dto';
import { UpdatePasswordtokenDto } from './dto/update-passwordtoken.dto';

@Injectable()
export class PasswordtokenService {
  create(createPasswordtokenDto: CreatePasswordtokenDto) {
    return 'This action adds a new passwordtoken';
  }

  findAll() {
    return `This action returns all passwordtoken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordtoken`;
  }

  update(id: number, updatePasswordtokenDto: UpdatePasswordtokenDto) {
    return `This action updates a #${id} passwordtoken`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordtoken`;
  }
}
