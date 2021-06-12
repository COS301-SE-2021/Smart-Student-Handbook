import { Controller, Post, Body } from '@nestjs/common';
import { EmailNotificationResponseDto} from "./dto/emailNotificationResponse.dto";
import { EmailNotificationRequestDto } from "./dto/emailNotificationRequest.dto"
import { NotificationService } from "./notification.service";

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {
	}

	@Post()
	async sendEmailNotification(@Body() emailNotificationDto: EmailNotificationRequestDto): Promise<EmailNotificationResponseDto> {
		return await this.notificationService.sendEmailNotification(emailNotificationDto);
	}

}
