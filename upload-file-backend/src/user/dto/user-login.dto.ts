import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'khang', description: 'User Info' })
  username: string;
}
export class UserTokenResponseDto {
  @ApiProperty({ example: 'Bearer xxxxxxxxx', description: 'Access Token' })
  accessToken: string;
}
