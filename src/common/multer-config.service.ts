import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { ConfigService } from '@nestjs/config';
import { diskStorage } from "multer";

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
                .join('');
              return cb(null, randomName + file.originalname);
            },
          }),
    };
  }
}
