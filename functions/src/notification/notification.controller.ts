import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { SendNotificationToAllRequestDto } from './dto/sendNotificationToAll.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { AuthService } from '../auth/auth.service';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService, private readonly authService: AuthService) {}

	@Post('sendEmailNotification')
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
		@Headers() headers,
	) {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notificationService.sendCollaborationRequest(
			userSender,
			userReceiver,
			notebookID,
			notebookTitle,
			userId,
		);
	}

	@Post('sendUserToUserPushNotification')
	// eslint-disable-next-line prettier/prettier,max-len
	async sendUserToUserPushNotification(@Body() singleNotificationRequest: SingleNotificationRequestDto, receiverUserID: string) {
		return this.notificationService.sendUserToUserPushNotification(singleNotificationRequest, receiverUserID);
	}

	@Get('getUserNotifications')
	async getUserNotifications(@Headers() headers) {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notificationService.getUserNotifications(userId);
	}

	@Get('getUnreadNotifications')
	async getUnreadNotifications(@Headers() headers) {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notificationService.getUnreadNotifications(userId);
	}

	@Post('createNotification')
	async createNotification(@Body() createNotificationDto: CreateNotificationDto, @Headers() headers) {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notificationService.createNotification(createNotificationDto, userId);
	}

	@Post('updateRead')
	async updateRead(@Body() notificationId: any) {
		return this.notificationService.updateRead(notificationId);
	}
}
