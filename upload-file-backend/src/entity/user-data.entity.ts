import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_data')
export class UserData {
  @IsInt()
  @IsNotEmpty()
  @Column()
  postId: number;

  @PrimaryColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  body: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.data)
  user: User;
}
