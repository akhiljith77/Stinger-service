import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomAuthGuard } from 'src/guard/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(CustomAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(createOrderDto, req?.user?.id);
  }

  @Get()
  @UseGuards(CustomAuthGuard)
  findAll(@Request() req: any) {
    return this.orderService.findAll(req?.user?.id);
  }

  @Get(':id')
  @UseGuards(CustomAuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CustomAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete('cancel/:id')
  @UseGuards(CustomAuthGuard)
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
