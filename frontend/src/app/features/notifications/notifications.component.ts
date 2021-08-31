import { Component, OnInit } from '@angular/core';
import {
	NotebookObservablesService,
	NotebookService,
	NotificationService,
} from '@app/services';
// import { Observable } from 'rxjs';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
	notifications: any[] = [];

	user: any;

	isCompleted: boolean = true;

	constructor(
		private notificationService: NotificationService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService
	) {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {
		this.isCompleted = false;

		this.user = JSON.parse(<string>localStorage.getItem('user'));

		if (this.user)
			this.notificationService
				.getUserNotifications(this.user.uid)
				.subscribe((notifications) => {
					this.notifications = notifications;

					this.isCompleted = true;
				});
	}

	accept(userId: string, notebookId: string, notebookTitle: string) {
		this.notebookObservables.setNotebook(notebookId, notebookTitle);
		this.notebookService
			.addAccess({
				displayName: this.user.displayName,
				userId: this.user.uid,
				profileUrl: this.user.profilePic,
				notebookId,
			})
			.subscribe((res) => {
				console.log(res);
			});
		// this.notificationService.updateRead(id);
		// this.noteMoreService.addCollaborator(notebookID);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	decline(userId: string, notebookId: string) {
		// this.notificationService.updateRead(id);
	}

	markAsRead(notificationID: string, index: number) {
		this.notifications[index].opened = true;
		// this.notificationService.updateRead(notificationID);
	}
}
