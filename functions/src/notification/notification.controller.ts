import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { SendNotificationToAllRequestDto } from './dto/sendNotificationToAll.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/createNotification.dto';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Post()
	// eslint-disable-next-line max-len
	async sendEmailNotification(
		@Body() emailNotificationDto: EmailNotificationRequestDto,
	): Promise<EmailNotificationResponseDto> {
		return this.notificationService.sendEmailNotification(emailNotificationDto);
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
			userId: sendNotificationToAllRequest.userId,
		};

		return this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
	}

	@Post('sendNotificationToTopic')
	async sendNotificationToTopic(@Body() sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {
		return this.notificationService.sendGroupPushNotification(sendNotificationToGroupRequest);
	}

	@Post('sendCollaborationRequest')
	async sendUserToUserEmail(
		@Body('userSender') userSender: string,
		@Body('userReceiver') userReceiver: string,
		@Body('notebookID') notebookID: string,
		@Body('notebookTitle') notebookTitle: string,
	) {
		return this.notificationService.sendCollaborationRequest(userSender, userReceiver, notebookID, notebookTitle);
	}

	@Post('sendUserToUserPushNotification')
	// eslint-disable-next-line prettier/prettier,max-len
	async sendUserToUserPushNotification(@Body() singleNotificationRequest: SingleNotificationRequestDto, receiverUserID: string) {
		return this.notificationService.sendUserToUserPushNotification(singleNotificationRequest, receiverUserID);
	}

	@Get('getUserNotifications/:userId')
	async getUserNotifications(@Param('userId') userId) {
		return this.notificationService.getUserNotifications(userId);
	}

	@Get('getUnreadNotifications/:userId')
	async getUnreadNotifications(@Param('userId') userId) {
		return this.notificationService.getUnreadNotifications(userId);
	}

	@Post('createNotification')
	async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationService.createNotification(createNotificationDto);
	}
}
