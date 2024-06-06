import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { Request } from 'express';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DeleteBookmarkDto } from './dto/delete-bookmark.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @ApiOperation({summary: 'Get all bookmarks'})
  @ApiResponse({
    status: 200,
    description: 'Get all bookmarks',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    return this.bookmarksService.findAll(req.user.uuid);
  }

  @ApiOperation({summary: 'Create a bookmark'})
  @ApiResponse({
    status: 200,
    description: 'Create a bookmark',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':uuid')
  create(
    @Req() req: Request & { user: { uuid: string, username: string } },
  ) {
    const dto: CreateBookmarkDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.bookmarksService.create(dto);
  }

  @ApiOperation({summary: 'Delete a bookmark'})
  @ApiResponse({
    status: 200,
    description: 'Delete a bookmark',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  remove(
    @Req() req: Request & { user: { uuid: string, username: string } },
  ) {
    const dto: DeleteBookmarkDto = { tweetUuid: req.params.uuid, userUuid: req.user.uuid };
    return this.bookmarksService.remove(dto);
  }
}
