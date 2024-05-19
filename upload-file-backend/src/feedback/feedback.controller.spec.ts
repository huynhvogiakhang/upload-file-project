import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/core/auth/auth.guard';
import { UserFeedback } from 'src/entity/user-feedback.entity';
import { User } from 'src/entity/user.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

class MockJwtAuthGuard extends JwtAuthGuard {
  // override methods if needed
}

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            createFeedBack: jest.fn().mockResolvedValue('Feedback created'),
          },
        },
        {
          provide: JwtAuthGuard,
          useClass: MockJwtAuthGuard,
        },
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

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create feedback', async () => {
    const feedbackDto = { feedBack: 'performance is ok' };
    const mockRequest: Partial<Request> = {};
    mockRequest['user'] = { username: 'newUser345' };

    await controller.createFeedBack(feedbackDto, mockRequest);
    expect(service.createFeedBack).toHaveBeenCalledWith(
      feedbackDto,
      mockRequest['user'],
    );
  });
});
