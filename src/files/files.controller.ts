import {
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
    Response,
    UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Response as ExpressResponse } from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { FilesService } from './files.service'

@ApiTags('files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @ApiOperation({ summary: 'Upload file' })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully'
    })
    @ApiConsumes('multipart/form-data')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file)
    }

    @ApiOperation({ summary: 'Get file by UUID' })
    @ApiResponse({
        status: 200,
        description: 'File retrieved successfully'
    })
    @Get(':uuid')
    async getFile(@Param('uuid') uuid: string, @Response() res: ExpressResponse) {
        // Validate UUID parameter
        if (!uuid || uuid === 'undefined' || uuid === 'null') {
            return res.status(400).json({ message: 'Invalid file UUID' })
        }

        const file = await this.filesService.findOneOrFail({ where: { uuid } })

        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ message: 'File not found' })
        }

        const filename = path.basename(file.path)
        const ext = path.extname(filename).toLowerCase()

        // Set appropriate content type
        let contentType = 'application/octet-stream'
        if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg'
        else if (ext === '.png') contentType = 'image/png'
        else if (ext === '.gif') contentType = 'image/gif'

        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`)

        const fileStream = fs.createReadStream(file.path)
        fileStream.pipe(res)
    }
}
