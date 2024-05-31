import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { File } from '../files/entities/file.entity';
import { SaveOptions, RemoveOptions, getRepository, DataSource } from 'typeorm';
import { UsersModule } from './users.module';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { v4 as uuidv4 } from 'uuid';


import { ConfigModule } from '@nestjs/config';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationRepository } from '../notifications/notification.repository';
import { UserRepository } from './user.repository';
import { RefreshToken } from '../refresh-tokens/entities/refresh-token.entities';
import { Tweet } from '../tweets/entities/tweet.entity';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT, 10),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: [User, Notification, File, RefreshToken, Tweet],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([User, Notification, File, RefreshToken, Tweet]),
            ],
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
            } as any as User;

            jest.spyOn(service, 'create').mockImplementation(async () => result);

            expect(await controller.create(userDto)).toBe(result);
        });

       
            it('should find all users', async () => {
                const users: User[] = [
                    { id: 1, uuid: "", username: 'user1', password: 'password1', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [] },
                    { id: 2, uuid: "", username: 'user2', password: 'password2', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [] },
                ] as any as User[];
                jest.spyOn(service, 'findMany').mockImplementation(async () => users);
                expect(await controller.findAll()).toBe(users);
            });


        it('should update a user', async () => {
            const userDto = { username: 'test', password: 'test' };
            const result: User = {
                id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
            } as any as User;

            jest.spyOn(service, 'update').mockImplementation(async () => result);

            expect(await controller.update('1', userDto)).toBe(result);
        });

        it('should delete a user', async () => {
            const result: User = {
                id: 1, uuid: "", username: 'test', password: 'test', biography: '', avatarFile: new File, refreshTokens: [], tweets: [], likedTweets: [], bookmarkedTweets: [], followers: [], following: [], createdAt: new Date, updatedAt: new Date, notifications: [],
            } as any as User;

            jest.spyOn(service, 'delete').mockImplementation(async () => result);

            expect(await controller.remove('1')).toBe(result);
        });

        
    });

});
