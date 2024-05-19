import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtStrategy } from 'src/core/auth/auth.strategy';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '807663f6-6016-4d14-b22b-f20a4e37efad',
              username: 'khang',
            }),
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: JwtStrategy,
          useValue: {
            createToken: jest
              .fn()
              .mockReturnValue(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtoYW5nIiwiaWF0IjoxNzE2MTEyODkwfQ.w7s6NFDbaC0SATWHoqJRnA6NaDpV11sD1i7HGwE8zuo',
              ),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('login', () => {
    it('should return a JWT token if user exists', async () => {
      const userInfo = { username: 'khang' };
      const result = await userService.login(userInfo);
      expect(jwtStrategy.createToken).toHaveBeenCalledWith({
        username: userInfo.username,
      });
      expect(result).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtoYW5nIiwiaWF0IjoxNzE2MTEyODkwfQ.w7s6NFDbaC0SATWHoqJRnA6NaDpV11sD1i7HGwE8zuo',
      });
    });

    it('should create a new user if user does not exist', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const userInfo = { username: 'khang' };
      const result = await userService.login(userInfo);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: userInfo.username,
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(jwtStrategy.createToken).toHaveBeenCalledWith({
        username: userInfo.username,
      });
      expect(result).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtoYW5nIiwiaWF0IjoxNzE2MTEyODkwfQ.w7s6NFDbaC0SATWHoqJRnA6NaDpV11sD1i7HGwE8zuo',
      });
    });
  });
});
