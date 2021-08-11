export class NotificationDto {
	readonly userID: string;

	readonly userNotificationID: string;

	readonly type: string;

	readonly heading: string;

	readonly body: string;

	readonly opened: boolean;
}
