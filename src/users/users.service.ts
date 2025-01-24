import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, ForgetPassword, LoginUserDto, ResetPassword } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Passwordtoken } from 'src/passwordtoken/entities/passwordtoken.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
    @InjectRepository(Passwordtoken)
    private readonly tokenConnection:Repository<Passwordtoken>,
    private jwtService: JwtService,
  ) {}
  async register(userdata: CreateUserDto): Promise<string> {
    try {
      const userExist = await this.userConnection.findOne({
        where: { email: userdata.email },
      });

      if (userExist) {
        throw new UnauthorizedException('User already exist' );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userdata.password, salt);
      const newUser = this.userConnection.create({
        ...userdata,
        password: hashedPassword,
      });
      this.userConnection.save(newUser);
      return 'user registered successfully';
    } catch (error) {
      throw error
    }
  }
  async login(loginDto: LoginUserDto) {
    try {
      const userExist = await this.userConnection.findOne({
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
      const expireTime:string= "7d"
      const token:string = this.generateToken(userExist,expireTime);
      return token;
    } catch (error) {
      throw error
    }
  }
  private generateToken(user: User,expiresIn:string) {
    const payload: object = {
      id: user?.id,
      email: user?.email,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'MY_SECRET_KEY',
      expiresIn: expiresIn,
    });
  }

  async update(updateUserDto: UpdateUserDto, UserId: string) {
    try {
      const userData = await this.userConnection.findOne({
        where: { id: UserId },
      });

      if (!userData) {
        return new UnauthorizedException('Invalid credentials');
      }
      Object.assign(userData, updateUserDto);
      this.userConnection.save(userData);
      return 'User update Successful';
    } catch (error) {
      throw error
    }
  }
  async deleteUser(UserId: string) {
    try {
      const userData = await this.userConnection.findOne({
        where:{id:UserId}
      })
      if (!userData) {
        return new UnauthorizedException("User Dosn't exist");
      }
      this.userConnection.delete(UserId);
      return "User Deleted Successfully"
    } catch (error) {
      throw error;
    }
  }
  async forgetPassword(emailDto:ForgetPassword){
    try {
      const isEmail = await this.userConnection.findOne(
        {where:{email:emailDto.email}}
      )
      if(!isEmail){
        return new UnauthorizedException("User Dosn't exist");
      }
      const expireTime ="10m"
       const token = this.generateToken(isEmail,expireTime)
       const passwordReset = new Passwordtoken();
       passwordReset.userId = isEmail.id;
       passwordReset.token = token;
       passwordReset.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
       await this.tokenConnection.save(passwordReset)
       const link = `http://localhost:3000/reset-password/${token}`
       return link;

    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPassworddto:ResetPassword,token:string){
    try {
     const payload=this.jwtService.verify(token)
     // console.log(resetPassworddto.password,token)

     const tokenExist=await this.tokenConnection.findOne({
      where:{token:token,isUsed:false,expiresAt:MoreThan(new Date)}
     })
    if(!tokenExist){
      return new UnauthorizedException("invalid token or token expired");
    }
     const userToChangePassword= await this.userConnection.findOne({
      where:{id:payload.id}
     })
     const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetPassworddto.password, salt);
      userToChangePassword.password=hashedPassword
      await this.userConnection.save(userToChangePassword);
      tokenExist.isUsed=true;
      await this.tokenConnection.save(tokenExist)
      return {message:'password Reset Successfully'}
    } catch (error) {
      throw error
    }
  }
}
 