import { Controller, Post, Body, Patch, Param, Delete, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgetPassword,
  LoginUserDto,
  ResetPassword,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';

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

  @Patch(':Id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('Id') UserId: string) {
    return this.usersService.update(updateUserDto, UserId);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
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
