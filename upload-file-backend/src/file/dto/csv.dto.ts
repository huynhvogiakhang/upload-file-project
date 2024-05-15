import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PrimaryColumn, Column } from 'typeorm';

export class CsvDTO {
  @IsInt()
  @IsNotEmpty()
  @Column()
  postId: number;

  @PrimaryColumn('uuid')
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
}
