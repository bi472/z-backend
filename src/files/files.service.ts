import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CrudBaseService } from 'src/common/crud-base.service';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { extname } from 'path';
import * as fs from 'fs';


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
        return this.create({ filename: file.filename, path: this.configService.get('MULTER_DEST') + "/" + file.filename});
    }
  }