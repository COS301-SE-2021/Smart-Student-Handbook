import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

import { EmailNotificationDto } from "./dto/emailNotification.dto"
import { NotificationService } from "./notification.service";
import { EmailInterface } from "./interfaces/email.interface";

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {
	}

	@Post()
	sendEmailNotification(@Body() emailNotificationDto: EmailNotificationDto, @Res() res: Response) {

		return res.send(this.notificationService.sendEmailNotification(emailNotificationDto));
	}

}

