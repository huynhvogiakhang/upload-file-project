import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserData } from 'src/entity/user-data.entity';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

describe('FileService', () => {
  let fileService: FileService;
  let userRepository: Repository<User>;
  let userDataRepository: Repository<UserData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '807663f6-6016-4d14-b22b-f20a4e37efad',
              username: 'khang',
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserData),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([
              [
                {
                  postId: 9,
                  id: 44,
                  name: 'hic molestiae et fuga ea maxime quod',
                  email: 'Marianna_Wilkinson@rupert.io',
                  body: 'qui sunt commodi\\nsint vel optio vitae quis qui non distinctio\\nid quasi modi dicta\\neos nihil sit inventore est numquam officiis',
                  userId: '807663f6-6016-4d14-b22b-f20a4e37efad',
                },
                {
                  postId: 1,
                  id: 1,
                  name: 'id labore ex et quam laborum',
                  email: 'Eliseo@gardner.biz',
                  body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium',
                  userId: '807663f6-6016-4d14-b22b-f20a4e37efad',
                },
              ],
              500,
            ]),
            insert: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userDataRepository = module.get<Repository<UserData>>(
      getRepositoryToken(UserData),
    );
  });

  describe('getUserFile', () => {
    it('should return paginated user data if user exists', async () => {
      const queryParams = { page: 1, size: 2 };
      const user = { username: 'khang' };
      const result = await fileService.getUserFile(queryParams, user);
      expect(result).toEqual({
        userData: [
          {
            postId: 9,
            id: 44,
            name: 'hic molestiae et fuga ea maxime quod',
            email: 'Marianna_Wilkinson@rupert.io',
            body: 'qui sunt commodi\\nsint vel optio vitae quis qui non distinctio\\nid quasi modi dicta\\neos nihil sit inventore est numquam officiis',
            userId: '807663f6-6016-4d14-b22b-f20a4e37efad',
          },
          {
            postId: 1,
            id: 1,
            name: 'id labore ex et quam laborum',
            email: 'Eliseo@gardner.biz',
            body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium',
            userId: '807663f6-6016-4d14-b22b-f20a4e37efad',
          },
        ],
        totalCount: 500,
        currentPage: 1,
        totalPages: 250,
        size: 2,
      });
    });

    it('should throw an error if user does not exist', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const queryParams = { page: 1, size: 2 };
      const user = { username: 'khang' };
      await expect(fileService.getUserFile(queryParams, user)).rejects.toThrow(
        'User not found!',
      );
    });
  });

  it('should upload file', async () => {
    const user = {
      id: '807663f6-6016-4d14-b22b-f20a4e37efad',
      username: 'khang',
    };
    const datas = [
      {
        postId: 1,
        id: 1,
        name: 'id labore ex et quam laborum',
        email: 'Eliseo@gardner.biz',
        body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium',
      },
      {
        postId: 1,
        id: 2,
        name: 'quo vero reiciendis velit similique earum',
        email: 'Jayne_Kuhic@sydney.com',
        body: 'est natus enim nihil est dolore omnis voluptatem numquam\\net omnis occaecati quod ullam at\\nvoluptatem error expedita pariatur\\nnihil sint nostrum voluptatem reiciendis et',
      },
    ];

    await fileService.uploadFile(datas, user);

    expect(userRepository.findOne).toBeCalledWith({
      where: { username: user.username },
    });
    expect(userDataRepository.insert).toBeCalledTimes(datas.length);
  });
});
