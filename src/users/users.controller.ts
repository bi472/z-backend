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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserDto} from './dto/user.dto';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {TransformInterceptor} from "../common/transform.interceptor";
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
@UseInterceptors(new TransformInterceptor(UserDto))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findMany({relations: ['followers', 'following']});
  }

  @ApiOperation({ summary: 'Get user by UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOneOrFail({ where: { uuid: uuid } });
  }

  @ApiOperation({ summary: 'Update user by UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update({ where: { uuid: uuid } }, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    return this.usersService.delete({ where: { uuid: uuid } });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Follow to user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Patch(':uuid/follow')
  async follow(
    @Param('uuid') uuid: string,
    @Req () req: Request & { user: { uuid: string, username: string } }
  ) {
    await this.usersService.follow(uuid, req.user.uuid);
    return this.usersService.findOneOrFail({ where: { uuid: uuid } , relations: ['following']});
  }

  @ApiOperation({ summary: 'Unfollow to user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid/follow')
  async unfollow(
    @Param('uuid') uuid: string,
    @Req () req: Request & { user: { uuid: string, username: string } }) {
    return this.usersService.unfollow(uuid, req.user.uuid);
  }
  
}