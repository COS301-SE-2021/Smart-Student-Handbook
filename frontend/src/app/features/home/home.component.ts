import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EditProfileComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	user: any;

	date: any;

	constructor(private router: Router, private dialog: MatDialog) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		if (this.user) {
			// eslint-disable-next-line no-underscore-dangle
			const milliseconds: number = this.user.dateJoined._seconds * 1000;
			const dateObject = new Date(milliseconds);
			this.date = dateObject.toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		}
	}

	updateProfile(): void {
		let screenWidth = '';
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		// Retrieve the current lodged in user from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		// check if a user is not null
		if (this.user) {
			// Open dialog and populate the data attributes of the form fields
			const dialogRef = this.dialog.open(EditProfileComponent, {
				width: screenWidth,
				height: '90vh',
				data: this.user,
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe(() => {
				// update the user object after the update
				this.user = JSON.parse(<string>localStorage.getItem('user'));
			});
		}
	}
}
