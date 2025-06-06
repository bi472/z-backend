import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { diskStorage } from 'multer'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor(private configService: ConfigService) {}

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: this.configService.get('MULTER_DEST'),
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('')
                    return cb(null, randomName + file.originalname)
                }
            }),
            limits: {
                fileSize: +this.configService.get('MULTER_LIMIT_SIZE'), // Лимит на один файл (5MB)
                files: 4, // Максимум 4 файла
                fieldSize: 25 * 1024 * 1024, // 25MB общий лимит на все поля
                fields: 10, // Максимум полей
                parts: 15 // Максимум частей в multipart
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(
                        new BadRequestException('Type mismatch. Only images supported.'),
                        false
                    )
                }
                cb(null, true)
            }
        }
    }
}
