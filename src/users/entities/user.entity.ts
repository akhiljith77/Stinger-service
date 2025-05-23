import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ default: 'local' }) // 'local' for email/password, 'google' for Google users
  provider: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: 0 })
  loginAttempts: number

  @Column({ type: 'timestamp', nullable: true })
  lastFailedLogin: Date;

  @CreateDateColumn()
  createdAt: Date;
}
