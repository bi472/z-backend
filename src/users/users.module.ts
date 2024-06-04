import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationsModule } from '../notifications/notifications.module'
import { FilesModule } from '../files/files.module'
import {MulterModule} from "@nestjs/platform-express";
import {MulterConfigService} from "../common/multer/multer-config.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
