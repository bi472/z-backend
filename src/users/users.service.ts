import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CrudBaseService } from '../common/crud-base.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, forwardRef, Inject } from '@nestjs/common';
import { Tweet } from '../tweets/entities/tweet.entity';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType } from '../notifications/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';

export class UsersService extends CrudBaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }


  async follow(profileUuid: string, subscriberUuid: string): Promise<User> {
    // Загружаем профиль и подписчика вместе с их связями
    const profile = await this.findOneOrFail({ where: { uuid: profileUuid }, relations: ['followers'] });
    const subscriber = await this.findOneOrFail({ where: { uuid: subscriberUuid }, relations: ['following'] });

    const alreadyFollowing = profile.followers.some(follower => follower.uuid === subscriberUuid);
    if (alreadyFollowing) {
      // Если подписчик уже подписан на профиль, выбрасываем исключение
      throw new ConflictException('User is already following this profile');
    }
  
    // Добавляем подписчика к списку подписчиков профиля и профиль к списку подписок подписчика
    profile.followers.push(subscriber);
    subscriber.following.push(profile);

    const createNotificationDto: CreateNotificationDto = {
      type: NotificationType.FOLLOW,
      createdBy: subscriber,
      userId: profile.uuid,
    }
  
    // Сохраняем изменения
    await super.save(profile);
    return super.save(subscriber);
  }
  
  async unfollow(profileUuid: string, subscriberUuid: string): Promise<User> {
    // Загружаем профиль и подписчика вместе с их связями
    const profile = await this.findOneOrFail({ where: { uuid: profileUuid }, relations: ['followers'] });
    const subscriber = await this.findOneOrFail({ where: { uuid: subscriberUuid }, relations: ['following'] });

    const notFollowing = !profile.followers.some(follower => follower.uuid === subscriberUuid);
    if (notFollowing) {
      // Если подписчик не подписан на профиль, выбрасываем исключение
      throw new ConflictException('User is not following this profile');
    }
  
    // Удаляем подписчика из списка подписчиков профиля и профиль из списка подписок подписчика
    profile.followers = profile.followers.filter((u) => u.uuid !== subscriber.uuid);
    subscriber.following = subscriber.following.filter((u) => u.uuid !== profile.uuid);
  
    // Сохраняем изменения
    await super.save(profile);
    return super.save(subscriber);
  }
  

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUser) {
      // Если пользователь найден, выбрасываем исключение
      throw new ConflictException('User with this username already exists');
    }
    dto.password = bcrypt.hashSync(dto.password, 10);
    return super.create(dto);
  }

  async update(
    criteria: FindOneOptions<User>,
    dto: UpdateUserDto,
  ): Promise<User> {
    dto.password = bcrypt.hashSync(dto.password, 10);
    return super.update(criteria, dto);
  }

  async findFollowers (uuid: string): Promise<User[]> {
    const user = await this.findOneOrFail({ where: { uuid }, relations: ['followers'] });
    return user.followers;
  }

  async findFollowing (uuid: string): Promise<User[]> {
    const user = await this.findOneOrFail({ where: { uuid }, relations: ['following'] });
    return user.following;
  }

  async findLikes (uuid: string): Promise<Tweet[]> {
    const user = await this.findOneOrFail({ where: { uuid }, relations: ['likedTweets'] });
    return user.likedTweets;
  }
}
