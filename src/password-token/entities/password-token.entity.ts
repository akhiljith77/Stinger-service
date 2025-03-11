import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('passwordTokens')
export class PasswordToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
