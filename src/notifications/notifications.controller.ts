import { Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../common/transform.interceptor';
import { NotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@UseInterceptors(new TransformInterceptor(NotificationDto))
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService
  ) { }

  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Get all notifications',

  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid } }, relations: ['createdBy'], order: { createdAt: 'DESC' } });
  }

  @ApiOperation({ summary: 'Get read notifications' })
  @ApiResponse({
    status: 200,
    description: 'Get read notifications',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/read')
  findRead(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid }, read: true }, relations: ['createdBy'] });
  }

  @ApiOperation({ summary: 'Get unread notifications' })
  @ApiResponse({
    status: 200,
    description: 'Get unread notifications',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/unread')
  findUnread(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.findMany({ where: { user: { uuid }, read: false }, relations: ['createdBy']} );
  }

  @ApiOperation({ summary: 'Read one notification by uuid' })
  @ApiResponse({
    status: 200,
    description: 'Read one notification by uuid',
    type: NotificationDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post(':uuid/read')
  read(@Param('uuid') uuid: string) {
    return this.notificationsService.read(uuid);
  }

  @ApiOperation({ summary: 'Read all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Read all notifications',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/read/all')
  readAll(
    @Req() req: Request & { user: { uuid: string, username: string } }
  ) {
    const uuid = req.user.uuid;
    return this.notificationsService.readAll(uuid);
  }

}
