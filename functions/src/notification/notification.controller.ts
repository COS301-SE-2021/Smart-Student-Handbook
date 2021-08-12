/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { SendNotificationToAllRequestDto } from './dto/sendNotificationToAll.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { NotificationService } from './notification.service';
import { EmailInterface } from './interfaces/email.interface';
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

  @Post()
  // eslint-disable-next-line max-len
	async sendEmailNotification(@Body() emailNotificationDto: EmailNotificationRequestDto): Promise<EmailNotificationResponseDto> {
		return this.notificationService.sendEmailNotification(
			emailNotificationDto,
		);
	}

  @Post('sendSingleNotification')
  async sendPushNotification(@Body() singleNotificationRequest: SingleNotificationRequestDto) {
  	return this.notificationService.sendSinglePushNotification(singleNotificationRequest);
  }

  @Post('subscribeToTopic')
  async subscribeToTopic(@Body() subscribeToTopicRequest: SubscribeToTopicRequestDto) {
  	return this.notificationService.subscribeToNotificationTopic(subscribeToTopicRequest);
  }

  @Post('sendNotificationToAll')
  async sendNotificationToAll(@Body() sendNotificationToAllRequest: SendNotificationToAllRequestDto) {
  	const sendNotificationToGroupRequest: SendNotificationToGroupRequestDto = {
  		title: sendNotificationToAllRequest.title,
  		body: sendNotificationToAllRequest.body,
  		topic: 'general',
  	};

  	return this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
  }

  @Post('sendNotificationToTopic')
  async sendNotificationToTopic(@Body() sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {
  	return this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
  }

  @Post('sendUserToUserEmail')
  async sendUserToUserEmail(@Body() userSender: string, userReceiver: string, email: EmailInterface) {
  	return this.notificationService.sendUserToUserEmail(userSender, userReceiver, email);
  }

	@Post('sendUserToUserPushNotification')
	// eslint-disable-next-line max-len
  async sendUserToUserPushNotification(@Body() singleNotificationRequest: SingleNotificationRequestDto, receiverUserID: string) {
  	return this.notificationService.sendUserToUserPushNotification(singleNotificationRequest, receiverUserID);
  }

	@Get('getUserNotifications')
	async getUserNotifications() {
		return this.notificationService.getUserNotifications();
	}

	@Get('getUnreadNotifications')
	async getUnreadNotifications() {
		return this.notificationService.getUnreadNotifications();
	}

	@Post('createNotification')
	async createNotification(@Body() notificationDto: NotificationDto) {
		return this.notificationService.createNotification(notificationDto);
	}
}
