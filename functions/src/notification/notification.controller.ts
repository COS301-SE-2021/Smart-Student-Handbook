/* eslint-disable prettier/prettier */
import {Body, Controller, Post} from '@nestjs/common';
import {EmailNotificationResponseDto} from './dto/emailNotificationResponse.dto';
import {EmailNotificationRequestDto} from './dto/emailNotificationRequest.dto';
import {SingleNotificationRequestDto} from './dto/singleNotificationRequest.dto';
import {SubscribeToTopicRequestDto} from './dto/subscribeToTopicRequest.dto';
import {SendNotificationToAllRequestDto} from './dto/sendNotificationToAll.dto';
import {SendNotificationToGroupRequestDto} from './dto/sendNotificationToGroup.dto';
import {NotificationService} from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendEmailNotification(
    @Body() emailNotificationDto: EmailNotificationRequestDto,
  ): Promise<EmailNotificationResponseDto> {
    return await this.notificationService.sendEmailNotification(
      emailNotificationDto,
    );
  }

  @Post('sendSingleNotification')
  async sendPushNotification(@Body() singleNotificationRequest: SingleNotificationRequestDto) {

    return await this.notificationService.sendSinglePushNotification(singleNotificationRequest);
  }

  @Post('subscribeToTopic')
  async subscribeToTopic(@Body() subscribeToTopicRequest: SubscribeToTopicRequestDto) {

    return await this.notificationService.subscribeToNotificationTopic(subscribeToTopicRequest);
  }

  @Post('sendNotificationToAll')
  async sendNotificationToAll(@Body() sendNotificationToAllRequest: SendNotificationToAllRequestDto) {

    const sendNotificationToGroupRequest: SendNotificationToGroupRequestDto = {
      title: sendNotificationToAllRequest.title,
      body: sendNotificationToAllRequest.body,
      topic: 'general'
    };


    return await this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
  }

  @Post('sendNotificationToTopic')
  async sendNotificationToTopic(@Body() sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {

    return await this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
  }
}
