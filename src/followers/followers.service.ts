import { ConflictException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType } from '../notifications/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { DeleteFollowerDto } from './dto/delete-followers.dto';

@Injectable()
export class FollowersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async findFollowers(uuid: string): Promise<User[]> {
    // Загружаем пользователя и всех его подписчиков
    const user = await this.usersService.findOneOrFail({ where: { uuid }, relations: ['followers'] });
    return user.followers;
  }

  async findFollowing(uuid: string): Promise<User[]> {
    // Загружаем пользователя и всех пользователей, на которых он подписан
    const user = await this.usersService.findOneOrFail({ where: { uuid }, relations: ['following'] });
    return user.following;
  }

  async follow(dto: CreateFollowerDto): Promise<User> {
    // Загружаем профиль и подписчика без связей
    const profile = await this.usersService.findOneOrFail({ where: { uuid: dto.profileUuid } });
    const subscriber = await this.usersService.findOneOrFail({ where: { uuid: dto.subscriberUuid } });

    // Проверяем, не подписан ли уже подписчик на профиль
    const alreadyFollowing = await this.isAlreadyFollowing(profile.uuid, subscriber.uuid);
    if (alreadyFollowing) {
      throw new ConflictException('User is already following this profile');
    }

    // Обновляем связи
    await this.addFollower(profile.uuid, subscriber.uuid);

    // Создаем уведомление
    const createNotificationDto: CreateNotificationDto = {
      type: NotificationType.FOLLOW,
      createdBy: subscriber,
      userId: profile.uuid,
    };
    await this.notificationsService.create(createNotificationDto);

    // Возвращаем подписчика с обновленными данными
    return subscriber;
}

async isAlreadyFollowing(profileUuid: string, subscriberUuid: string): Promise<boolean> {
    const profile = await this.usersService.findOneOrFail({ where: { uuid: profileUuid }, relations: ['followers'] });
    return profile.followers.some(follower => follower.uuid === subscriberUuid);
}

private async addFollower(profileUuid: string, subscriberUuid: string): Promise<void> {
    const profile = await this.usersService.findOneOrFail({ where: { uuid: profileUuid }, relations: ['followers'] });
    const subscriber = await this.usersService.findOneOrFail({ where: { uuid: subscriberUuid }, relations: ['following'] });

    profile.followers.push(subscriber);
    subscriber.following.push(profile);

    await this.usersService.save(profile);
    await this.usersService.save(subscriber);
}

  async unfollow(dto: DeleteFollowerDto): Promise<User> {
    // Загружаем профиль и подписчика вместе с их связями
    const profile = await this.usersService.findOneOrFail({ where: { uuid: dto.profileUuid }, relations: ['followers'] });
    const subscriber = await this.usersService.findOneOrFail({ where: { uuid: dto.subscriberUuid }, relations: ['following'] });

    const notFollowing = !profile.followers.some(follower => follower.uuid === dto.subscriberUuid);
    if (notFollowing) {
      // Если подписчик не подписан на профиль, выбрасываем исключение
      throw new ConflictException('User is not following this profile');
    }

    // Удаляем подписчика из списка подписчиков профиля и профиль из списка подписок подписчика
    profile.followers = profile.followers.filter((u) => u.uuid !== subscriber.uuid);
    subscriber.following = subscriber.following.filter((u) => u.uuid !== profile.uuid);

    // Сохраняем изменения
    await this.usersService.save(profile);
    return this.usersService.save(subscriber);
  }
}
