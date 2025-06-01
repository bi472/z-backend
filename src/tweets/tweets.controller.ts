import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger'
import { Request } from 'express'
import { FindManyOptions } from 'typeorm'
import { TransformInterceptor } from '../common/transform.interceptor'
import { FilesService } from '../files/files.service'
import { CreateTweetDto } from './dto/create-tweet.dto'
import { TweetDto } from './dto/tweet.dto'
import { UpdateTweetDto } from './dto/update-tweet.dto'
import { TweetsService } from './tweets.service'

@ApiTags('tweets')
@Controller('tweets')
@UseInterceptors(new TransformInterceptor(TweetDto))
export class TweetsController {
    constructor(
        private readonly tweetsService: TweetsService,
        private readonly filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Create tweet' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TweetDto
    })
    @ApiConsumes('multipart/form-data')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FilesInterceptor('images', 4)) // Максимум 4 изображения
    @Post()
    async create(
        @Body() createTweetDto: CreateTweetDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request & { user: { uuid: string; username: string } }
    ) {
        createTweetDto.userUuid = req.user.uuid

        // Upload files if any
        if (files && files.length > 0) {
            const uploadedFiles = await Promise.all(
                files.map(file => this.filesService.uploadFile(file))
            )
            createTweetDto.imageFiles = uploadedFiles.map(file => file.uuid)
        }

        return this.tweetsService.create(createTweetDto)
    }

    @ApiOperation({ summary: 'Get tweet by uuid' })
    @ApiResponse({
        status: 200,
        description: 'Get tweet by uuid',
        type: TweetDto,
        isArray: true
    })
    @Get(':uuid')
    async findOne(@Req() req: Request) {
        return this.tweetsService.findOneOrFail({ where: { uuid: req.params.uuid } })
    }

    @ApiOperation({ summary: 'Get all tweets by user uuid' })
    @ApiResponse({
        status: 200,
        description: 'Get all tweets by user uuid',
        type: TweetDto,
        isArray: true
    })
    @Get('/user/:uuid')
    async findByUser(@Req() req: Request) {
        return this.tweetsService.findByUser(req.params.uuid)
    }
    @ApiOperation({ summary: 'Get all tweets by username' })
    @ApiResponse({
        status: 200,
        description: 'Get all tweets by username',
        type: TweetDto,
        isArray: true
    })
    @Get('/username/:username')
    async findByUsername(
        @Req() req: Request,
        @Query('offset') offset: string,
        @Query('limit') limit: string
    ) {
        const offsetNum = parseInt(offset) || 0
        const limitNum = parseInt(limit) || 10
        return this.tweetsService.findByUsername(req.params.username, offsetNum, limitNum)
    }

    @ApiOperation({ summary: 'Get all tweets or followed by user uuid' })
    @ApiResponse({
        status: 200,
        description: 'Get all tweets or followed by user uuid',
        type: TweetDto,
        isArray: true
    })
    @Get()
    async findAll(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
        @Query('followedByUserUuid') followedByUserUuid: string
    ) {
        const offsetNumber = parseInt(offset, 10) || 0
        const limitNumber = parseInt(limit, 10) || 10
        const criteria: FindManyOptions = {
            relations: ['user', 'user.avatarFile', 'images'],
            order: { createdAt: 'DESC' },
            skip: offsetNumber,
            take: limitNumber
        }

        if (!followedByUserUuid) return this.tweetsService.findMany(criteria)
        else return this.tweetsService.findFollowedBy(criteria, followedByUserUuid)
    }

    @ApiOperation({ summary: 'Update tweet by UUID' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TweetDto
    })
    @UseGuards(AuthGuard('jwt'))
    @Patch(':uuid')
    async update(
        @Body() updateTweetDto: UpdateTweetDto & { userUuid: string },
        @Req() req: Request & { user: { uuid: string; username: string } }
    ) {
        updateTweetDto.userUuid = req.user.uuid
        return this.tweetsService.update(
            { where: { uuid: req.params.uuid }, relations: ['user'] },
            updateTweetDto
        )
    }

    @ApiOperation({ summary: 'Delete tweet by UUID' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully deleted.',
        type: TweetDto
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':uuid')
    async remove(@Req() req: Request & { user: { uuid: string; username: string } }) {
        return this.tweetsService.remove(
            { where: { uuid: req.params.uuid }, relations: ['user'] },
            req.user.uuid
        )
    }
}
