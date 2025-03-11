import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgetPassword,
  LoginUserDto,
  ResetPassword,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordToken } from 'src/password-token/entities/password-token.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  private readonly userCacheKey = 'user-list';
  constructor(
    @InjectRepository(User)
    private readonly userConnection: Repository<User>,
    @InjectRepository(PasswordToken)
    private tokenRepository: Repository<PasswordToken>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private jwtService: JwtService,
  ) {}

  async register(userdata: CreateUserDto): Promise<string> {
    try {
      const userExist: User = await this.userConnection.findOne({
        where: { email: userdata.email },
      });
      if (userExist) {
        throw new UnauthorizedException('User already exist');
      }
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(userdata.password, salt);
      const newUser: User = this.userConnection.create({
        ...userdata,
        password: hashedPassword,
      });
      this.userConnection.save(newUser);
      return 'user registered successfully';
    } catch (error) {
      throw error;
    }
  }
  async login(loginDto: LoginUserDto) {
    try {
      const userExist: User = await this.userConnection.findOne({
        where: { email: loginDto.email },
      });
      if (!userExist) {
        return new UnauthorizedException('Invalid credentials');
      }
      const isPasswordMatch: boolean = await bcrypt.compare(
        loginDto.password,
        userExist.password,
      );
      if (!isPasswordMatch) {
        return new UnauthorizedException('Invalid credentials');
      }
      const expireIn: string = '7d';
      const token: string = this.generateToken(userExist, expireIn);
      return {
        message: 'User login Successfully',
        token: token,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(updateUserDto: UpdateUserDto, UserId: string) {
    try {
      const userData: User = await this.userConnection.findOne({
        where: { id: UserId },
      });

      if (!userData) {
        return new UnauthorizedException('Invalid credentials');
      }

      Object.assign(userData, updateUserDto);
      this.userConnection.save(userData);
      return 'User update Successful';
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const cachedUsers: User = await this.cacheManager.get(this.userCacheKey);
      if (cachedUsers) {
        return cachedUsers;
      }
      const users: User[] = await this.userConnection.find();
      if (!users) {
        return new HttpException('no records found', HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(this.userCacheKey, users);
      return users;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(UserId: string) {
    try {
      const userData: User = await this.userConnection.findOne({
        where: { id: UserId },
      });
      if (!userData) {
        return new UnauthorizedException("User Dosn't exist");
      }
      this.userConnection.delete(UserId);
      return 'User Deleted Successfully';
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgetPassword) {
    try {
      const userExist: User = await this.userConnection.findOne({
        where: { email: forgotPasswordDto.email },
      });

      if (!userExist) {
        return new UnauthorizedException('Invalid credentials');
      }

      const expireIn: string = '30m';
      const resetToken: string = this.generateToken(userExist, expireIn);
      const passwordReset: PasswordToken = new PasswordToken();
      passwordReset.userId = userExist.id;
      passwordReset.token = resetToken;
      passwordReset.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.tokenRepository.save(passwordReset);

      const resetPasswordLink: string = `http://localhost:5173/reset-password/${resetToken}`;

      return {
        message: 'Password reset link sent to email',
        link: resetPasswordLink,
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(passwordDto: ResetPassword, token: string) {
    try {
      const payload: any = this.jwtService.verify(token);
      const passwordReset: PasswordToken = await this.tokenRepository.findOne({
        where: { token, isUsed: false, expiresAt: MoreThan(new Date()) },
      });

      if (!passwordReset) {
        throw new UnauthorizedException('Invalid token or expired token');
      }

      const userExist: User = await this.userConnection.findOne({
        where: { id: payload.id },
      });

      if (!userExist) {
        throw new UnauthorizedException('User doesnt exist');
      }

      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(
        passwordDto.password,
        salt,
      );

      userExist.password = hashedPassword;
      await this.userConnection.save(userExist);

      passwordReset.isUsed = true;
      await this.tokenRepository.save(passwordReset);

      return { message: 'Password successfully reset' };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: User, expireIn: string) {
    const payload: object = {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'MY_SECRET_KEY',
      expiresIn: expireIn,
    });
  }
}
