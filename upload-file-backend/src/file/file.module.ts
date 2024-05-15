import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/entity/user-data.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserData, User])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
