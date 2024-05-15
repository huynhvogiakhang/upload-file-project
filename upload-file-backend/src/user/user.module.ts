import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategyModule } from 'src/core/auth/auth.module';
import { User } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtStrategyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
