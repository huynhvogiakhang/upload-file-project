import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFeedback } from 'src/entity/user-feedback.entity';
import { Repository } from 'typeorm';
import { FeedbackReqDto } from './dto/feedback.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(UserFeedback)
    private feedbacksRepository: Repository<UserFeedback>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createFeedBack(data: FeedbackReqDto, user: any) {
    const userData = await this.usersRepository.findOne({
      where: { username: user.username },
    });
    if (!userData) {
      throw new BadRequestException('User Not Found');
    }
    await this.feedbacksRepository.insert({
      feedBack: data.feedBack,
      user: userData,
    });

    return;
  }
}
