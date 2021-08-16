import { Component, OnInit } from '@angular/core';
import { NoteMoreService, NotificationService } from '@app/services';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
	constructor(
		private notificationService: NotificationService,
		private noteMoreService: NoteMoreService
	) {}

	/* notificationList: Observable<any[]> =
		this.notificationService.getUserNotifications(); */

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {
		this.notificationService.getUnreadNotifications();
	}

	accept(id: string) {
		this.notificationService.updateRead(id);
		// this.noteMoreService.addCollaborator(notebookID);
	}

	decline(id: string) {
		this.notificationService.updateRead(id);
	}

	markAsRead(notificationID: string) {
		this.notificationService.updateRead(notificationID);
	}
}
interface Notifications {
	userid: string;
	type: string;
	body: string;
	heading: string;
	opened: boolean;
}
