import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_data')
export class UserData {
  @ApiProperty({ description: 'The ID of the post', example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Column()
  postId: number;

  @ApiProperty({ description: 'The ID of the user', example: 1 })
  @PrimaryColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;

  @ApiProperty({
    description: 'The body of the user data',
    example: 'Lorem ipsum dolor sit amet',
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  body: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.data)
  user: User;
}
