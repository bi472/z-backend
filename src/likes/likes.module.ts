import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { UsersModule } from '../users/users.module';
import { TweetsModule } from '../tweets/tweets.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '../tweets/entities/tweet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    UsersModule,
    TweetsModule,
    NotificationsModule
  ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
