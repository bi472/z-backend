import { Injectable } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { FilesService } from '../files/files.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class AvatarsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly filesService: FilesService
    ) {}
    async uploadAvatar(userUuid: string, file: Express.Multer.File): Promise<User> {
        // если уже есть аватар, то сначала обновляем ссылку, а потом удаляем старый файл
        const user = await this.usersService.findOneOrFail({
            where: { uuid: userUuid },
            relations: ['avatarFile']
        })
        const oldAvatarFile = user.avatarFile

        // загружаем новый файл
        user.avatarFile = await this.filesService.uploadFile(file)

        // сохраняем пользователя с новым аватаром
        const savedUser = await this.usersService.save(user)

        // теперь можно безопасно удалить старый файл
        if (oldAvatarFile) {
            await this.filesService.deleteFile(oldAvatarFile.uuid)
        }

        // Возвращаем пользователя с полной информацией об avatarFile
        return await this.usersService.findOneOrFail({
            where: { uuid: userUuid },
            relations: ['avatarFile']
        })
    }
    async deleteAvatar(userUuid: string): Promise<User> {
        const user = await this.usersService.findOneOrFail({
            where: { uuid: userUuid },
            relations: ['avatarFile']
        })
        if (user.avatarFile) {
            const avatarFileUuid = user.avatarFile.uuid
            // Сначала убираем ссылку на файл у пользователя
            user.avatarFile = null
            const savedUser = await this.usersService.save(user)
            // Теперь можно безопасно удалить файл
            await this.filesService.deleteFile(avatarFileUuid)

            // Возвращаем обновленного пользователя
            return await this.usersService.findOneOrFail({
                where: { uuid: userUuid },
                relations: ['avatarFile']
            })
        }
        return user
    }
}
