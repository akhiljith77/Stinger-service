import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
private readonly userRepository:Repository<User>
){

  }
  register(userdata:CreateUserDto){
  const newUser = this.userRepository.create(userdata)
  return this.userRepository.save(newUser)
  }
}
