import { BadRequestException, Injectable } from '@nestjs/common'
import { CrudBaseService } from '../common/crud-base.service'
import { CreateTweetDto } from './dto/create-tweet.dto'
import { UpdateTweetDto } from './dto/update-tweet.dto'
import { Tweet } from './entities/tweet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { NotificationsService } from '../notifications/notifications.service'
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto'
import { NotificationType } from '../notifications/notification-type.enum'
import { FilesService } from '../files/files.service'

@Injectable()
export class TweetsService extends CrudBaseService<Tweet, CreateTweetDto, UpdateTweetDto> {
    constructor(
        @InjectRepository(Tweet)
        protected tweetsRepository: Repository<Tweet>,
        protected usersService: UsersService,
        protected notificationsService: NotificationsService,
        protected filesService: FilesService
    ) {
        super(tweetsRepository)
    }

    async create(dto: CreateTweetDto): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } })

        // Create tweet first
        const tweet = await super.create({ ...dto, user })

        // Associate uploaded images with the tweet
        if (dto.imageFiles && dto.imageFiles.length > 0) {
            const images = await this.filesService.findMany({
                where: { uuid: In(dto.imageFiles) }
            })

            // Update each image to associate with this tweet
            for (const image of images) {
                image.tweet = tweet
                await this.filesService.save(image)
            }
        } // Return tweet with images and user avatar
        return this.findOneOrFail({
            where: { uuid: tweet.uuid },
            relations: ['user', 'user.avatarFile', 'images']
        })
    }
    async findFollowedBy(
        criteria: FindManyOptions<Tweet>,
        followedByUserUuid: string
    ): Promise<Tweet[]> {
        // Fetch the user who is following others
        const user = await this.usersService.findOneOrFail({
            where: { uuid: followedByUserUuid },
            relations: ['following']
        })

        // Get the UUIDs of the users that the given user is following
        const followedUserUuids = user.following.map(followedUser => followedUser.uuid)

        // If no users are followed, return an empty array
        if (followedUserUuids.length === 0) {
            return []
        }

        // Modify the criteria to include tweets from the followed users, images и user.avatarFile
        const modifiedCriteria: FindManyOptions<Tweet> = {
            ...criteria,
            relations: ['user', 'user.avatarFile', 'images'],
            where: {
                ...criteria.where,
                user: {
                    uuid: In(followedUserUuids)
                }
            },
            order: {
                ...criteria.order,
                createdAt: 'DESC'
            }
        }

        // Fetch the tweets based on the modified criteria
        return this.tweetsRepository.find(modifiedCriteria)
    }
    async findByUsername(
        username: string,
        offset: number = 0,
        limit: number = 10
    ): Promise<Tweet[]> {
        const user = await this.usersService.findOneOrFail({ where: { username } })
        // use query builder to get tweets by user with avatar
        const tweets = await this.tweetsRepository
            .createQueryBuilder('tweet')
            .leftJoinAndSelect('tweet.user', 'user')
            .leftJoinAndSelect('user.avatarFile', 'avatarFile')
            .leftJoinAndSelect('tweet.images', 'images')
            .where('user.uuid = :uuid', { uuid: user.uuid })
            .orderBy('tweet.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany()
        return tweets
    }

    async findByUser(userUuid: string): Promise<Tweet[]> {
        const user = await this.usersService.findOneOrFail({
            where: { uuid: userUuid },
            relations: ['tweets', 'tweets.images', 'tweets.user', 'tweets.user.avatarFile']
        })
        return user.tweets
    }

    async update(
        criteria: FindOneOptions<Tweet>,
        dto: UpdateTweetDto & { userUuid: string }
    ): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: dto.userUuid } })
        const tweet = await super.findOneOrFail(criteria)
        if (tweet.user.uuid !== user.uuid) {
            throw new BadRequestException('You can only update your own tweets')
        }
        return super.update(criteria, { ...dto, user })
    }
    async remove(criteria: FindOneOptions<Tweet>, userUuid: string): Promise<Tweet> {
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } })
        const tweet = await super.findOneOrFail({
            ...criteria,
            relations: ['user', 'images']
        })

        if (tweet.user.uuid !== user.uuid) {
            throw new BadRequestException('You can only delete your own tweets')
        }

        // First, detach any files associated with this tweet
        if (tweet.images && tweet.images.length > 0) {
            for (const image of tweet.images) {
                image.tweet = null
                await this.filesService.save(image)
            }
        }

        // Now delete the tweet
        return super.delete(criteria)
    }

    async like(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['likedBy', 'user'] })
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } })
        const isLiked = tweet.likedBy.some(u => u.uuid === user.uuid)

        if (isLiked) {
            throw new BadRequestException('You have already liked this tweet')
        }

        tweet.likedBy.push(user)
        const createNotificationDto: CreateNotificationDto = {
            userId: tweet.user.uuid,
            type: NotificationType.LIKE,
            createdBy: user,
            tweetId: tweet.uuid
        }

        await this.notificationsService.create(createNotificationDto)
        return super.save(tweet)
    }

    async unlike(uuid: string, userUuid: string): Promise<Tweet> {
        const tweet = await this.findOneOrFail({ where: { uuid }, relations: ['likedBy'] })
        const user = await this.usersService.findOneOrFail({ where: { uuid: userUuid } })

        const likedUser = tweet.likedBy.find(likedUser => likedUser.uuid === user.uuid)
        if (!likedUser) {
            throw new BadRequestException('You have not liked this tweet')
        }

        await this.tweetsRepository
            .createQueryBuilder()
            .relation(Tweet, 'likedBy')
            .of(tweet)
            .remove(user)

        // Обновляем tweet объект после удаления связи
        const updatedTweet = await super.findOneOrFail({ where: { uuid }, relations: ['likedBy'] })

        return updatedTweet
    }
}
