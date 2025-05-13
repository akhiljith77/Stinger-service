import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { OrderItem } from './entities/order.item.entity';
import { Products } from 'src/products/entities/product.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderConnection: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemConnection: Repository<OrderItem>,
    @InjectRepository(Products)
    private productConnection: Repository<Products>,
    private datasource: DataSource,
    private readonly cartService: CartService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<string> {
    const { items } = createOrderDto;

    const queryRunner: QueryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.userId = userId;
      order.totalAmount = 0;
      order.status = OrderStatus.ORDERED;
      order.paymentStatus = PaymentStatus.PENDING;

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems: OrderItem[] = [];
      let totalAmount: number = 0;

      for (const item of items) {
        const product = await this.productConnection.findOne({
          where: { id: item?.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product?.stock < item?.quantity) {
          throw new BadRequestException(
            `Product ${product.name} only has ${product.stock} items in stock`,
          );
        }

        if (
          item?.size &&
          product?.size &&
          !product?.size?.includes(item?.size as any)
        ) {
          throw new BadRequestException(
            `Size ${item.size} not available for product ${product.name}`,
          );
        }

        if (
          item?.color &&
          product?.color &&
          !product?.color.includes(item?.color as any)
        ) {
          throw new BadRequestException(
            `Color ${item.size} not available for product ${product.name}`,
          );
        }

        product.stock -= item?.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product = product;
        orderItem.productId = product?.id;
        orderItem.quantity = item?.quantity;
        orderItem.price = product?.price;
        orderItem.size = item?.size;
        orderItem.color = item?.color;

        orderItems.push(orderItem);
        totalAmount += product?.price * item?.quantity;
      }
      await queryRunner.manager.save(orderItems);

      savedOrder.totalAmount = totalAmount;
      savedOrder.orderItems = orderItems;
      await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();
      for (const item of items) {
        await this.cartService.delete(userId, item.productId);
      }

      return 'Order placed successfully';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId?: string) {
    const queryBuilder = this.orderConnection
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product');

    try {
      if (userId) {
        queryBuilder.where('order.userId = :userId', { userId });
      }

      queryBuilder.orderBy('order.createdAt', 'DESC');

      const orders = await queryBuilder.getMany();
      if (orders.length < 1) {
        return 'No Orders';
      }
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.orderConnection.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderConnection.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.product'],
      });
      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      if (updateOrderDto?.paymentStatus) {
        order.paymentStatus = updateOrderDto?.paymentStatus;
      }

      if (updateOrderDto?.status) {
        order.status = updateOrderDto?.status;
      }

      await this.orderConnection.save(order);
      return 'Updated Successfully';
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(id: string) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const order = await this.orderConnection.findOne({
        where: { id: id },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException(
          'Cannot cancel an order that has been delivered',
        );
      }

      for (const item of order.orderItems) {
        const product = await this.productConnection.findOne({
          where: { id: item.productId },
        });

        if (product) {
          product.stock += item.quantity;
          await queryRunner.manager.save(product);
        }
      }

      order.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return 'Order cancelled';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
