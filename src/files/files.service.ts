import {Injectable} from '@nestjs/common';
import {CreateFileDto} from './dto/create-file.dto';
import {UpdateFileDto} from './dto/update-file.dto';
import {CrudBaseService} from '../common/crud-base.service';
import {File} from './entities/file.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import {Repository} from 'typeorm';
import * as fs from "node:fs";


@Injectable()
export class FilesService extends CrudBaseService<File, CreateFileDto, UpdateFileDto> {
    constructor(
        @InjectRepository(File)
        protected filesRepository: Repository<File>,
        private configService: ConfigService
    ) {
        super(filesRepository);
    }

    async uploadFile(file: Express.Multer.File): Promise<File> {
        // импортировать multer dest из config service и записать в path
        // generate filename
        const filename = file.filename;
        return this.create({filename, path: this.configService.get('MULTER_DEST') + "/" + filename});
    }

    async deleteFile(fileUuid: string): Promise<void> {
        // удалить файл из хранилища
        // удалить запись о файле из базы
        const file = await this.findOneOrFail({where: {uuid: fileUuid}});
        const filePath = file.path;
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
                this.delete({where: {uuid: file.uuid}});
            }
        });
    }
}