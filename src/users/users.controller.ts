import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto:LoginUserDto){
    return this.usersService.login(loginUserDto)
  }

  @Patch(":Id")
  update(@Body() updateUserDto:UpdateUserDto,@Param("Id") UserId:string){
    return this.usersService.update(updateUserDto,UserId)
  }

  @Delete(":Id")
  delete(@Param("Id") UserId:string){
    return this.usersService.deleteUser(UserId)
  }



}
