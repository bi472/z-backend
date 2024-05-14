import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { ApiTags } from '@nestjs/swagger';
import { TweetDto } from './dto/tweet.dto';
import { Request } from 'express';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import {TransformInterceptor} from "../common/transform.interceptor";

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

  @Get()
  async findAll() {
    return this.tweetsService.findMany({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
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
  
}
