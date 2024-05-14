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
  UseInterceptors,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserDto} from './dto/user.dto';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {TransformInterceptor} from "../common/transform.interceptor";

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
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findMany();
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
  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    return this.usersService.delete({ where: { uuid: uuid } });
  }
}
