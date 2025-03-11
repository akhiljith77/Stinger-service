import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Cart } from './entities/cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createCartDto: CreateCartDto,
    @Request() req: any,
  ): Promise<any> {
    return this.cartService.create(req?.user?.id, createCartDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req: any): Promise<{ data: Cart[]; total: number }> {
    return this.cartService.findAll(req?.user?.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cartService.findOne(req?.user?.id, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(req?.user?.id, id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.cartService.delete(req?.user?.id, id);
  }
}
