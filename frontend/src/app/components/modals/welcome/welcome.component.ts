import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '@app/services';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
	user: any;

	constructor(
		private dialogRef: MatDialogRef<WelcomeComponent>,
		private accountService: AccountService
	) {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	Confirm(): void {
		this.dialogRef.close(true);
	}
}
