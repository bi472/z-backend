import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudBaseService } from 'src/common/crud-base.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationType } from 'src/notifications/notification-type.enum';

@Injectable()
export class TweetsService extends CrudBaseService<Tweet, CreateTweetDto, UpdateTweetDto> {
    constructor(
        @InjectRepository(Tweet)
        protected tweetsRepository: Repository<Tweet>,
        protected usersService: UsersService,
        protected notificationsService: NotificationsService
    ) {
        super(tweetsRepository);
    }

    async create(dto: CreateTweetDto): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });
        return super.create({ ...dto, user });
    }

    async findByUsername(username: string): Promise<Tweet[]> {
        const user = await this.usersService.findOneOrFail({ where: { username }, relations: ['tweets'] });
        return user.tweets;
    }

    async update(criteria: FindOneOptions<Tweet>, dto: UpdateTweetDto & { userUuid: string }): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });
        const tweet = await super.findOneOrFail(criteria);
        if (tweet.user.uuid !== user.uuid) {
            throw new BadRequestException('You can only update your own tweets');
        }
        return super.update(criteria, { ...dto, user });
    }

    async remove(criteria: FindOneOptions<Tweet>, userUuid: string): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } });
        const tweet = await super.findOneOrFail(criteria);
        if (tweet.user.uuid !== user.uuid) {
            throw new BadRequestException('You can only delete your own tweets');
        }
        return super.delete(criteria);
    }

    async like(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['likedBy', 'user'],  });
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } });
        const isLiked = tweet.likedBy.some(u => u.uuid === user.uuid);

        if (isLiked) {
            throw new BadRequestException('You have already liked this tweet');
        }

        tweet.likedBy.push(user);
        const createNotificationDto: CreateNotificationDto  = {
            userId: tweet.user.uuid,
            type: NotificationType.LIKE,
            createdBy: user,
            tweetId: tweet.uuid
        };

        await this.notificationsService.create(createNotificationDto);
        return super.save(tweet);
    }

    async unlike(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['likedBy'] });
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } });

        const likedUser = tweet.likedBy.find(likedUser => likedUser.uuid === user.uuid);
        if (!likedUser) {
            throw new BadRequestException('You have not liked this tweet');
        }

        await this.tweetsRepository
        .createQueryBuilder()
        .relation(Tweet, "likedBy")
        .of(tweet)
        .remove(user);
    
        // Обновляем tweet объект после удаления связи
        const updatedTweet = await super.findOneOrFail({ where: { uuid }, relations: ['likedBy'] });
    
        return updatedTweet;
    }
    
    async getBookmarks(userUuid: string): Promise<Tweet[]> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid }, relations: ['bookmarkedTweets'] });
        return user.bookmarkedTweets;
    }


    async bookmark(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['bookmarkedBy'] });
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } });
        const isBookmarked = tweet.bookmarkedBy.some(u => u.uuid === user.uuid);
        if (isBookmarked) {
            throw new BadRequestException('You have already bookmarked this tweet');
        }
        tweet.bookmarkedBy.push(user);
        return this.tweetsRepository.save(tweet);
    }

    async unbookmark(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['bookmarkedBy'] });
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } });

        const bookmarkedUser = tweet.bookmarkedBy.find(bookmarkedUser => bookmarkedUser.uuid === user.uuid);
        if (!bookmarkedUser) {
            throw new BadRequestException('You have not bookmarked this tweet');
        }

        tweet.bookmarkedBy = tweet.bookmarkedBy.filter(u => u.uuid !== user.uuid);
        return this.tweetsRepository.save(tweet);
    }
}
