import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn("uuid")
  Id: string;
  @Column()
  name: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;
  @Column({nullable:true, unique:true})
  phoneNumber: string;
}
