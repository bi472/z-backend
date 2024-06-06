import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { DeleteBookmarkDto } from './dto/delete-bookmark.dto';
import { UsersService } from '../users/users.service';
import { Tweet } from '../tweets/entities/tweet.entity';
import { TweetsService } from '../tweets/tweets.service';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tweetsService: TweetsService,
  ) { }

  async findAll(userUuid: string): Promise<Tweet[]> {
    const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid }, relations: ['bookmarkedTweets'] });
    return user.bookmarkedTweets;
  }

  async create(dto: CreateBookmarkDto): Promise<Tweet> {
    const tweet = await this.tweetsService.findOneOrFail({ where: { uuid: dto.tweetUuid }, relations: ['bookmarkedBy'] });
    const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });
    const isBookmarked = tweet.bookmarkedBy.some(u => u.uuid === user.uuid);
    if (isBookmarked) {
      throw new BadRequestException('You have already bookmarked this tweet');
    }
    tweet.bookmarkedBy.push(user);
    return this.tweetsService.save(tweet);
  }

  async remove(dto: DeleteBookmarkDto): Promise<Tweet> {
    const tweet = await this.tweetsService.findOneOrFail({ where: { uuid: dto.tweetUuid }, relations: ['bookmarkedBy'] });
    const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });

    const bookmarkedUser = tweet.bookmarkedBy.find(bookmarkedUser => bookmarkedUser.uuid === user.uuid);
    if (!bookmarkedUser) {
      throw new BadRequestException('You have not bookmarked this tweet');
    }

    tweet.bookmarkedBy = tweet.bookmarkedBy.filter(u => u.uuid !== user.uuid);
    return this.tweetsService.save(tweet);
  }
}
