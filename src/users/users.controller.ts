import { Controller, Post, Body, Patch, Param, Delete, Get, Request, UseGuards, Req, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgetPassword,
  LoginUserDto,
  ResetPassword,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomAuthGuard } from 'src/guard/auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // console.log("redirecting to google login")
    // return { message: 'Redirecting to Google login...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // console.log("Google login callback triggered:", req.user); // Log user data
    if (!req.user) {
      throw new UnauthorizedException("Google authentication failed");
    }
    try {
      return await this.usersService.googleLogin(req.user);
    } catch (error) {
      console.error('Error in googleAuthRedirect:', error);
      throw new InternalServerErrorException('Failed to process Google login');
    }
  }

  @Patch(':Id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('Id') UserId: string) {
    return this.usersService.update(updateUserDto, UserId);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('profile')
  @UseGuards(CustomAuthGuard)
  getProfile(@Request() req: any){
    return this.usersService.getProfile(req?.user?.id)
  }

  @Delete(':Id')
  delete(@Param('Id') UserId: string) {
    return this.usersService.deleteUser(UserId);
  }

  @Post('forgot-password')
  forgetPassword(@Body() ForgetPassword: ForgetPassword) {
    return this.usersService.forgotPassword(ForgetPassword);
  }

  @Patch('reset-password/:token')
  resetPassword(
    @Body() resetPasswordDto: ResetPassword,
    @Param('token') token: string,
  ) {
    return this.usersService.resetPassword(resetPasswordDto, token);
  }
}
