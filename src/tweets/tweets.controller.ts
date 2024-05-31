import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { ApiTags } from '@nestjs/swagger';
import { TweetDto } from './dto/tweet.dto';
import { Request } from 'express';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import {TransformInterceptor} from "../common/transform.interceptor";
import { FindManyOptions } from 'typeorm';

@ApiTags('tweets')
@Controller('tweets')
@UseInterceptors(new TransformInterceptor(TweetDto))
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createTweetDto: CreateTweetDto,
    @Req() req: Request & { user: { uuid: string, username: string } }) { // Update the type of req.user
    createTweetDto.userUuid = req.user.uuid; // Update the userUuid
    return this.tweetsService.create(createTweetDto);
  }

  @Get(':uuid')
  async findOne(@Req() req: Request) {
    return this.tweetsService.findOneOrFail({ where: { uuid: req.params.uuid } });
  }

  @Get('/user/:uuid')
  async findByUser(@Req() req: Request) {
    return this.tweetsService.findByUser(req.params.uuid);
  }

  @Get('/username/:username')
  async findByUsername(@Req() req: Request) {
    return this.tweetsService.findByUsername(req.params.username);
  }

  @Get()
  async findAll(
    @Query('followedByUserUuid') followedByUserUuid: string,
  ) {
    const criteria: FindManyOptions = {
      relations: ['user'],
      order: { createdAt: 'DESC' },
    };

    if (!followedByUserUuid)
      return this.tweetsService.findMany(criteria);
    else 
      return this.tweetsService.findFollowedBy(criteria, followedByUserUuid)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid')
  async update(
    @Body() updateTweetDto: UpdateTweetDto & { userUuid: string },
    @Req() req: Request & { user: { uuid: string, username: string } },
  ) {
    updateTweetDto.userUuid = req.user.uuid;
    return this.tweetsService.update({ where: { uuid: req.params.uuid }, relations: ['user'] }, updateTweetDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  async remove(@Req() req: Request & { user: { uuid: string, username: string } }) {
    return this.tweetsService.remove({ where: { uuid: req.params.uuid }, relations: ['user'] }, req.user.uuid);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid/like')
  async like(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    return this.tweetsService.like(req.params.uuid, req.user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid/like')
  async unlike(@Req() req: Request & { user: { uuid: string, username: string } }) {
    
    return this.tweetsService.unlike(req.params.uuid, req.user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('bookmarks/all')
  async getBookmarks(@Req() req: Request & { user: { uuid: string, username: string } }) {
    return this.tweetsService.getBookmarks(req.user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid/bookmark')
  async unbookmark(@Req() req: Request & { user: { uuid: string, username: string } }) {
    return this.tweetsService.bookmark(req.params.uuid, req.user.uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid/bookmark')
  async bookmark(@Req() req: Request & { user: { uuid: string, username: string } }) {
    return this.tweetsService.unbookmark(req.params.uuid, req.user.uuid);
  }

}
