import { Controller, Post, Body } from '@nestjs/common';
import { EmailNotificationDto } from "./dto/emailNotification.dto"
import { NotificationService } from "./notification.service";
import { EmailInterface } from "./interfaces/email.interface";

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {
	}

	@Post()
	async sendEmailNotification(@Body() emailNotificationDto: EmailNotificationDto): Promise<string>{
		return this.notificationService.sendEmailNotification(emailNotificationDto);
	}
}

