import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserData } from './user-data.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserFeedback } from './user-feedback.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique ID of the user.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column({ length: 500 })
  @ApiProperty({ description: 'The username of the user.', example: 'khang' })
  username: string;

  @OneToMany(() => UserData, (userdata) => userdata.user)
  data: UserData[];

  @OneToMany(() => UserFeedback, (userFeedback) => userFeedback.user)
  feedBack: UserFeedback[];
}
