import {Injectable} from '@nestjs/common';
import {User} from "../users/entities/user.entity";
import {FilesService} from "../files/files.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class AvatarsService {
    constructor(
        private usersService: UsersService,
        private filesService: FilesService
    ) {
    }

    async uploadAvatar(userUuid: string, file: Express.Multer.File): Promise<User> {
        // если уже есть аватар, то удаляем его из хранилища
        const user = await this.usersService.findOneOrFail({where: {uuid: userUuid}, relations: ['avatarFile']});
        if (user.avatarFile) {
            await this.filesService.deleteFile(user.avatarFile.uuid);
        }
        user.avatarFile = await this.filesService.uploadFile(file);
        return this.usersService.save(user);
    }

    async deleteAvatar(userUuid: string): Promise<User> {
        const user = await this.usersService.findOneOrFail({where: {uuid: userUuid}, relations: ['avatarFile']});
        if (user.avatarFile) {
            await this.filesService.deleteFile(user.avatarFile.uuid);
            user.avatarFile = null;
            return this.usersService.save(user);
        }
        return user;
    }
}
