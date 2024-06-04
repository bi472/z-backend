import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { MulterConfigService } from '../common/multer/multer-config.service'
import { MulterModule } from '@nestjs/platform-express'

@Module({
    imports: [
        TypeOrmModule.forFeature([File]),
    ],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {
}
