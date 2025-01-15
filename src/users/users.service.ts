import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly dbConnection: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(userdata: CreateUserDto): Promise<string> {
    try {
      const userExist = await this.dbConnection.findOne({
        where: { email: userdata.email },
      });

      if (userExist) {
        throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userdata.password, salt);
      const newUser = this.dbConnection.create({
        ...userdata,
        password: hashedPassword,
      });
      this.dbConnection.save(newUser);
      return 'user registered successfully';
    } catch (error) {
      console.log(error);
    }
  }
  async login(loginDto: LoginUserDto) {
    try {
      const userExist = await this.dbConnection.findOne({
        where: { email: loginDto.email },
      });

      if (!userExist) {
        return new UnauthorizedException('Invalid credentials');
      }
      const isPasswordMatch = await bcrypt.compare(
        loginDto.password,
        userExist.password,
      );

      if (!isPasswordMatch) {
        return new UnauthorizedException('Invalid credentials');
      }
      const token = this.generateToken(userExist);
      return token;
    } catch (error) {}
  }
  private generateToken(user: User) {
    const payload: object = {
      id: user?.id,
      email: user?.email,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'MY_SECRET_KEY',
      expiresIn: '7d',
    });
  }

  async update(updateUserDto: UpdateUserDto, UserId: string) {
    try {
      const userData = await this.dbConnection.findOne({
        where: { id: UserId },
      });

      if (!userData) {
        return new UnauthorizedException('Invalid credentials');
      }
      Object.assign(userData, updateUserDto);
      this.dbConnection.save(userData);
      return 'User update Successful';
    } catch (error) {}
  }
  async deleteUser(UserId: string) {
    try {
      const userData = await this.dbConnection.findOne({
        where:{id:UserId}
      })
      if (!userData) {
        return new UnauthorizedException("User Dosn't exist");
      }
      this.dbConnection.delete(UserId);
      return "User Deleted Successfully"
    } catch (error) {}
  }
}
