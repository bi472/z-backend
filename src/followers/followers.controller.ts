import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { DeleteFollowerDto } from './dto/delete-followers.dto';

@ApiTags('user-followers')
@Controller('user-followers')
export class FollowersController {
  constructor(
    private readonly followersService: FollowersService
  ) { }

  @ApiOperation({ summary: 'Get followers of user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto
  })
  @Get(':uuid/followers')
  async followers(@Param('uuid') uuid: string) {
    return this.followersService.findFollowers(uuid)
  }

  @ApiOperation({ summary: 'Get following of user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto
  })
  @Get(':uuid/following')
  async following(@Param('uuid') uuid: string) {
    return this.followersService.findFollowing(uuid)
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Follow to user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto
  })
  @Patch(':uuid/follow')
  async follow(
    @Param('uuid') uuid: string,
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const dto: CreateFollowerDto = { subscriberUuid: req.user.uuid, profileUuid: uuid }
    return this.followersService.follow(dto)
  }

  @ApiOperation({ summary: 'Unfollow to user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid/follow')
  async unfollow(
    @Param('uuid') uuid: string,
    @Req() req: Request & { user: { uuid: string, username: string } }) {
    const dto: DeleteFollowerDto = { subscriberUuid: req.user.uuid, profileUuid: uuid }
    return this.followersService.unfollow(dto)
  }
}
