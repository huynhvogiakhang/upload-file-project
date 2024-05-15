import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_feedback')
export class UserFeedback {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique ID of the user feed back.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  @ApiProperty({
    description: 'The feedback of upload file performance',
    example: 'The upload performance is bad',
  })
  feedBack: string;

  @ManyToOne(() => User, (user) => user.data)
  user: User;
}
