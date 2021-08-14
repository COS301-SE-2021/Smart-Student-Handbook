import { Component, OnInit } from '@angular/core';
import { NoteMoreService, NotificationService } from '@app/services';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
	/* notificationList: Notifications[] = [
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
	]; */
	constructor(
		private notificationService: NotificationService,
		private noteMoreService: NoteMoreService
	) {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {
		this.notificationService.getUnreadNotifications();
	}

	accept(id: string, notebookID: string) {
		this.notificationService.updateRead(id);
		this.noteMoreService.addCollaborator(notebookID);
	}

	decline(id: string) {
		this.notificationService.updateRead(id);
	}

	markAsRead(notificationID: string) {
		this.notificationService.updateRead(notificationID);
	}
}
/* interface Notifications {
	id: string;
	type: string;
	title: string;
	content: string;
	read: boolean;
} */
