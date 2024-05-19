import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserFeedback } from 'src/entity/user-feedback.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let feedbackRepository: Repository<UserFeedback>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(UserFeedback),
          useValue: {
            insert: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '807663f6-6016-4d14-b22b-f20a4e37efad',
              username: 'khang',
            }),
          },
        },
      ],
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    feedbackRepository = module.get<Repository<UserFeedback>>(
      getRepositoryToken(UserFeedback),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createFeedBack', () => {
    it('should create a feedback if user exists', async () => {
      const data = { feedBack: 'performance is ok' };
      const user = { username: 'khang' };
      await feedbackService.createFeedBack(data, user);
      expect(feedbackRepository.insert).toHaveBeenCalledWith({
        feedBack: data.feedBack,
        user: {
          id: '807663f6-6016-4d14-b22b-f20a4e37efad',
          username: 'khang',
        },
      });
    });

    it('should throw an error if user does not exist', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const data = { feedBack: 'performance is ok' };
      const user = { username: 'khang' };
      await expect(feedbackService.createFeedBack(data, user)).rejects.toThrow(
        'User Not Found',
      );
    });
  });
});
