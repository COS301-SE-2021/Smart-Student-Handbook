import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
	notificationList: Notifications[] = [
		{
			id: '1',
			type: 'general',
			title: 'Notification One',
			content: 'more info on the notification',
			read: false,
		},
		{
			id: '2',
			type: 'collaboration',
			title: 'Notification Two',
			content:
				'more info on the notification xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			read: false,
		},
		{
			id: '3',
			type: 'general',
			title: 'Notification Three',
			content: 'more info on the notification',
			read: true,
		},
	];
	// constructor() {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}

	accept(id: string) {}

	decline(id: string) {}

	markAsRead(id: string, index: number) {
		this.notificationList[index].read = true;
	}
}
interface Notifications {
	id: string;
	type: string;
	title: string;
	content: string;
	read: boolean;
}
