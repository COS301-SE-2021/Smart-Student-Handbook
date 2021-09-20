export interface Notification {
	readonly userID: string;

	readonly userNotificationId;

	readonly type: string;

	readonly heading: string;

	readonly body: string;

	readonly opened: boolean;

	readonly notificationId?: string;
}
