import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartConnection: Repository<Cart>,
  ) {}

  async create(userId: string, createCartDto: CreateCartDto){
    try {
      const existingItem = await this.cartConnection.findOne({
        where: {
          user_id: userId,
          product_id: createCartDto.product_id,
        },
      });

      if (existingItem) {
        existingItem.quantity += createCartDto.quantity;
        this.cartConnection.save(existingItem);
        return 'Product updated to Cart';
      }

      const cart = this.cartConnection.create({
        user_id: userId,
        ...createCartDto,
      });
      this.cartConnection.save(cart);
      return 'Product added to Cart';
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    try {
      const cartItems = await this.cartConnection.find({
        where: { user_id: userId },
        relations: ['product'],
      });

      if (!cartItems || cartItems.length === 0) {
        throw new HttpException('Cart is Empty', HttpStatus.NOT_FOUND);
      }

      const totalAmount = cartItems.reduce((total, item) => {
        return total + item?.product?.price * item?.quantity;
      }, 0);

      return {
        data: cartItems,
        total: totalAmount,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const cartItem = await this.cartConnection.findOne({
        where: {
          id: id,
          user_id: userId,
        },
        relations: ['product'],
      });

      if (!cartItem) {
        return new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }

      return cartItem;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: string, updateCartDto: UpdateCartDto) {
    try {
      const cartItem: Cart = await this.cartConnection.findOne({
        where: { id: id, user_id: userId },
      });
      if (!cartItem) {
        return new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(cartItem, updateCartDto);
      this.cartConnection.save(cartItem);
      return 'Cart update Successful';
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: string, id: string) {
    try {
      const product: Cart = await this.cartConnection.findOne({
        where:[ { id : id },{product_id:id}],
      });

      if (!product) {
        return new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
    const deletedData =  await this.cartConnection.delete(product.id);
      return 'Product Deleted Successfully';
    } catch (error) {
      throw error;
    }
  }
}
