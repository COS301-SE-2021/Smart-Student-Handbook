import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EditProfileComponent, WelcomeComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/services';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	user: any;

	date: any;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private accountService: AccountService
	) {
		// localStorage.getItem('user')
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
				// eslint-disable-next-line no-underscore-dangle
				const milliseconds: number = user.dateJoined._seconds * 1000;
				const dateObject = new Date(milliseconds);
				this.date = dateObject.toLocaleString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});
			}
		});
	}

	updateProfile(): void {
		let screenWidth = '';

		if (window.innerWidth <= 1000) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		// check if a user is not null
		if (this.user) {
			// Open dialog and populate the data attributes of the form fields
			this.dialog.open(EditProfileComponent, {
				width: screenWidth,
				// height: '90vh',
				data: this.user,
			});
		}
	}

	async logout() {
		if (this.user) {
			this.accountService.singOut().subscribe(
				() => {
					this.router.navigate(['account/login']);
				},
				(err) => {
					console.log(`Error: ${err.error.message}`);
				}
			);
		}
	}
}
