import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { TransformInterceptor } from '../common/transform.interceptor'
import { TweetDto } from '../tweets/dto/tweet.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { UserProfileGuard } from './guard/user-profile.guard'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
@UseInterceptors(new TransformInterceptor(UserDto))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: UserDto
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findMany({ relations: ['followers', 'following', 'avatarFile'] })
    }

    @ApiOperation({ summary: 'Get user by UUID' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @Get(':uuid')
    async findOne(@Param('uuid') uuid: string) {
        return this.usersService.findOneOrFail({
            where: { uuid: uuid },
            relations: ['avatarFile']
        })
    }

    @ApiOperation({ summary: 'Update user by UUID' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @UseGuards(AuthGuard('jwt'), UserProfileGuard)
    @Patch(':uuid')
    async update(
        @Param('uuid') uuid: string,
        @Query('type') type: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        if (type === 'biography') {
            const { biography } = updateUserDto
            const updatedUser = await this.usersService.updateBio(uuid, biography)
            return this.usersService.findOneOrFail({
                where: { uuid: uuid },
                relations: ['avatarFile']
            })
        }

        await this.usersService.update({ where: { uuid: uuid } }, updateUserDto)
        return this.usersService.findOneOrFail({
            where: { uuid: uuid },
            relations: ['avatarFile']
        })
    }

    @ApiOperation({ summary: 'Delete user by UUID' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @UseGuards(AuthGuard('jwt'), UserProfileGuard)
    @Delete(':uuid')
    async remove(@Param('uuid') uuid: string) {
        return this.usersService.delete({ where: { uuid: uuid } })
    }

    @ApiOperation({ summary: 'User by username' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto
    })
    @Get('username/:username')
    async findOneByUsername(@Param('username') username: string) {
        return this.usersService.findOneOrFail({
            where: { username: username },
            relations: ['avatarFile']
        })
    }

    @ApiOperation({ summary: 'Get likes of user' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: TweetDto
    })
    @Get(':uuid/likes')
    async likes(@Param('uuid') uuid: string) {
        return this.usersService.findLikes(uuid)
    }
}
