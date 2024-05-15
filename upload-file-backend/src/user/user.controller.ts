import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, UserTokenResponseDto } from './dto/user-login.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: String,
    isArray: true,
  })
  async login(@Body() userInfo: LoginDto): Promise<UserTokenResponseDto> {
    return this.userService.login(userInfo);
  }
}
