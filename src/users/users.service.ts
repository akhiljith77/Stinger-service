import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
  ) { }


  async register(userdata: CreateUserDto): Promise<any> {
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
      await this.cacheManager.del(this.userCacheKey)

      return {
        success: true,
        message: 'user registered successfully',
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
    }
  }

  async login(loginDto: LoginUserDto) {
    try {
      const now = new Date();
      const userExist: User = await this.userConnection.findOne({
        where: { email: loginDto.email },
      });

      if (!userExist) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (
        userExist.loginAttempts > 5 &&
        userExist.lastFailedLogin &&
        now.getTime() - new Date(userExist.lastFailedLogin).getTime() < 30000
      ) {
        throw new UnauthorizedException(
          `Too many failed attempts. Try again after ${30 - Math.floor((now.getTime() - new Date(userExist.lastFailedLogin).getTime()) / 1000)
          } seconds`
        );
      }

      const isPasswordMatch: boolean = await bcrypt.compare(
        loginDto.password,
        userExist.password,
      );

      if (!isPasswordMatch) {
        userExist.loginAttempts = (userExist.loginAttempts || 0) + 1;
        userExist.lastFailedLogin = now;
        await this.userConnection.save(userExist);

        throw new UnauthorizedException('Invalid credentials');
      }

      userExist.loginAttempts = 0;
      userExist.lastFailedLogin = null;
      await this.userConnection.save(userExist);

      const expireIn: string = '7d';
      const token: string = this.generateToken(userExist, expireIn);

      return {
        success: true,
        message: 'User login Successfully',
        token: token,
        userRole: userExist?.role
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userConnection.findOne({ where: { email } });
  }

  async createGoogleUser(userData: { email: string; name: string; profileImage: string }) {
    const newUser = this.userConnection.create({
      email: userData.email,
      name: userData.name,
      profileImage: userData.profileImage,
      password: null, // No password for Google users
      provider: 'google',
    });

    await this.userConnection.save(newUser);
    return newUser;
  }

  async googleLogin(user: any) {

    try {
      const token = this.generateToken(user, '7d');
      return {
        success: true,
        message: 'Google login successful',
        token,
        user,
      };
    } catch (error) {
      console.error('Error in googleLogin:', error);
      throw new InternalServerErrorException('Failed to generate token for Google login');
    }
  }


  async update(updateUserDto: UpdateUserDto, UserId: string) {
    try {
      const userData: User = await this.userConnection.findOne({
        where: { id: UserId },
      });

      if (!userData) {
        throw new UnauthorizedException('Invalid credentials');
      }

      Object.assign(userData, updateUserDto);
      this.userConnection.save(userData);

      return {
        success: true,
        message: 'User update Successful'
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
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

  async findOne(id: string): Promise<User> {
    const user = await this.userConnection.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  async getProfile(userId: string) {
    const user = await this.findOne(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || null,
      address: user.address || null,
      joinDate: user.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
    };
  }


  async deleteUser(UserId: string) {
    try {
      const userData: User = await this.userConnection.findOne({
        where: { id: UserId },
      });
      if (!userData) {
        throw new UnauthorizedException("User Dosn't exist");
      }
      this.userConnection.delete(UserId);
      await this.cacheManager.del(this.userCacheKey)
      return {
        success: true,
        message: 'User Deleted Successfully'
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
    }
  }

  async forgotPassword(forgotPasswordDto: ForgetPassword) {
    try {
      const userExist: User = await this.userConnection.findOne({
        where: { email: forgotPasswordDto.email },
      });

      if (!userExist) {
        throw new UnauthorizedException('Invalid credentials');
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
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
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

      return { success: true, message: 'Password successfully reset' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during login')
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
