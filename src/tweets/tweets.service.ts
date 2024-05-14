import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudBaseService } from 'src/common/crud-base.service';
import { TweetDto } from './dto/tweet.dto';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetsService extends CrudBaseService<Tweet, CreateTweetDto, UpdateTweetDto>{
    constructor(
        @InjectRepository(Tweet)
        protected tweetsRepository: Repository<Tweet>,
        protected usersService: UsersService
    ) {
        super(tweetsRepository);
    }
    
    async create(dto: CreateTweetDto): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } });
        return super.create({ ...dto, user });
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
}
