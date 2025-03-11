import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Products } from 'src/products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Products, { onDelete: 'CASCADE' })
  product: Products;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  color?: string;
}
