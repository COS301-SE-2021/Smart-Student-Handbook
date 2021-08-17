// eslint-disable-next-line @typescript-eslint/naming-convention
export class createNotificationDto {
	readonly userID?: string;

	readonly type?: string;

	readonly heading?: string;

	readonly body?: string;

	readonly opened?: boolean;
}
