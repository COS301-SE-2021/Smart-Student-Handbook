import { Component, Inject, OnInit } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from '@angular/material/dialog';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import { Router } from '@angular/router';

@Component({
	selector: 'app-view-profile',
	templateUrl: './view-profile.component.html',
	styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent {
	date: any;

	profilePicURL: string = '../../../../assets/images/defaultProfile.jpg';

	constructor(
		public dialogRef: MatDialogRef<ViewProfileComponent>,
		@Inject(MAT_DIALOG_DATA) public data: User,
		private accountService: AccountService,
		private dialog: MatDialog,
		private router: Router
	) {
		if (data) {
			this.profilePicURL = data.profilePic;

			// eslint-disable-next-line no-underscore-dangle
			// @ts-ignore
			// eslint-disable-next-line no-underscore-dangle
			const milliseconds: number = data.dateJoined._seconds * 1000;
			// eslint-disable-next-line no-underscore-dangle
			const dateObject = new Date(milliseconds);
			this.date = dateObject.toLocaleString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	dismiss(): void {
		this.dialogRef.close();
	}
}
