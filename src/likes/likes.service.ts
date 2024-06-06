import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { TweetsService } from '../tweets/tweets.service';
import { UsersService } from '../users/users.service';
import { DeleteLikeDto } from './dto/delete-like.dto';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType } from '../notifications/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { Repository } from 'typeorm';
import { Tweet } from '../tweets/entities/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetsRepository: Repository<Tweet>,
    private readonly tweetsService: TweetsService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService
  ) { }

  async like(dto: CreateLikeDto): Promise<any> {
    const tweet = await this.tweetsService.findOneOrFail({ where: { uuid: dto.tweetUuid }, relations: ['likedBy', 'user'], });
    const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });
    const isLiked = tweet.likedBy.some(u => u.uuid === user.uuid);

    if (isLiked) {
      throw new BadRequestException('You have already liked this tweet');
    }

    tweet.likedBy.push(user);
    const createNotificationDto: CreateNotificationDto = {
      userId: tweet.user.uuid,
      type: NotificationType.LIKE,
      createdBy: user,
      tweetId: tweet.uuid
    };

    await this.notificationsService.create(createNotificationDto);
    return this.tweetsService.save(tweet);
  }

  async dislike(dto: DeleteLikeDto): Promise<any> {
    const tweet = await this.tweetsService.findOneOrFail({ where: { uuid: dto.tweetUuid }, relations: ['likedBy'] });
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });

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
        const updatedTweet = await this.tweetsService.findOneOrFail({ where: { uuid: dto.tweetUuid }, relations: ['likedBy'] });
    
        return updatedTweet;
  }
}

