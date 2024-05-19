import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/core/auth/auth.strategy';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: JwtStrategy,
  ) {}

  async login(userInfo: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { username: userInfo.username },
    });
    if (!user) {
      const newUser = this.usersRepository.create({
        username: userInfo.username,
      });
      this.usersRepository.save(newUser);
    }
    const payload = { username: userInfo.username };
    const token = await this.authService.createToken(payload);
    return { accessToken: token };
  }
}
