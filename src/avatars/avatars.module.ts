import {Module} from '@nestjs/common';
import {AvatarsService} from './avatars.service';
import {AvatarsController} from './avatars.controller';
import {FilesModule} from "../files/files.module";
import {MulterModule} from "@nestjs/platform-express";
import {MulterConfigService} from "../common/multer/multer-config.service";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        FilesModule,
        UsersModule,
        MulterModule.registerAsync({
            useClass: MulterConfigService
        }),
    ],
    controllers: [AvatarsController],
    providers: [AvatarsService]
})
export class AvatarsModule {
}
