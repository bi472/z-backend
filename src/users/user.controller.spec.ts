import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { File } from 'src/files/entities/file.entity';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a user', async () => {
        const userDto = { username: 'test', password: 'test' };
        const result: User = {
            id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
            hasId: function (): boolean {
                throw new Error('Function not implemented.');
            },
            save: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            remove: function (options?: RemoveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            softRemove: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            recover: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            reload: function (): Promise<void> {
                throw new Error('Function not implemented.');
            }
        };

        jest.spyOn(service, 'create').mockImplementation(async () => result);

        expect(await controller.create(userDto)).toBe(result);
    });

    it('should get a user', async () => {
        const result: User = {
            id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
            hasId: function (): boolean {
                throw new Error('Function not implemented.');
            },
            save: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            remove: function (options?: RemoveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            softRemove: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            recover: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            reload: function (): Promise<void> {
                throw new Error('Function not implemented.');
            }
        };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne('1')).toBe(result);
    });

    it('should update a user', async () => {
      const userDto = { username: 'test', password: 'test' };
      const result: User = {
        id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
        hasId: function (): boolean {
            throw new Error('Function not implemented.');
        },
        save: function (options?: SaveOptions): Promise<User> {
            throw new Error('Function not implemented.');
        },
        remove: function (options?: RemoveOptions): Promise<User> {
            throw new Error('Function not implemented.');
        },
        softRemove: function (options?: SaveOptions): Promise<User> {
            throw new Error('Function not implemented.');
        },
        recover: function (options?: SaveOptions): Promise<User> {
            throw new Error('Function not implemented.');
        },
        reload: function (): Promise<void> {
            throw new Error('Function not implemented.');
        }
    };

      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', userDto)).toBe(result);
    });

    it('should delete a user', async () => {
        const result: User = {
            id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
            hasId: function (): boolean {
                throw new Error('Function not implemented.');
            },
            save: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            remove: function (options?: RemoveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            softRemove: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            recover: function (options?: SaveOptions): Promise<User> {
                throw new Error('Function not implemented.');
            },
            reload: function (): Promise<void> {
                throw new Error('Function not implemented.');
            }
        };

      jest.spyOn(service, 'delete').mockImplementation(async () => result);

      expect(await controller.remove('1')).toBe(result);
    });
  });
});