import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { UsersModule } from '../users/users.module';
import { TweetsModule } from '../tweets/tweets.module';

@Module({
  imports: [UsersModule, TweetsModule],
  controllers: [BookmarksController],
  providers: [BookmarksService]
})
export class BookmarksModule {}
