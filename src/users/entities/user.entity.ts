import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
enum Role {
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

  @Column({default:Role.USER})
  role:Role;

}
