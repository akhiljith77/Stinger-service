import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async register(userdata: CreateUserDto): Promise<string> {
    try {
      const userExist = await this.userRepository.findOne({
        where: { email: userdata.email },
      });

      if (userExist) {
        throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userdata.password, salt);
      const newUser = this.userRepository.create({
        ...userdata,
        password: hashedPassword,
      });
      this.userRepository.save(newUser);
      return 'user registered successfully';
    } catch (error) {
      console.log(error);
    }
  }
  async login(loginDto:LoginUserDto){

  }
}

