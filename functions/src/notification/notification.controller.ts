import { Controller, Post, Body } from '@nestjs/common';
import { EmailNotificationDto } from "./dto/emailNotification.dto"

@Controller('notification')
export class NotificationController {
	@Post()
	sendEmailNotification(@Body() emailNotificationDto: EmailNotificationDto){

	}
}

