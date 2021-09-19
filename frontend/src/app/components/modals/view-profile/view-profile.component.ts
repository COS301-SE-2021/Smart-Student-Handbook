import { Component, Inject } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from '@angular/material/dialog';
import { AccountService, NotebookService, ProfileService } from '@app/services';
import { Router } from '@angular/router';
import { ExploreNoteListComponent } from '@app/components';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

@Component({
	selector: 'app-view-profile',
	templateUrl: './view-profile.component.html',
	styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent {
	date: any;

	userProfile: any;

	userNotebooks: any;

	isLoadComplete: boolean = false;

	viewProfileFailed: boolean = false;

	errorMessage: string = '';

	displayName: string = '';

	constructor(
		public dialogRef: MatDialogRef<ViewProfileComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private accountService: AccountService,
		private dialog: MatDialog,
		private router: Router,
		private profileService: ProfileService,
		private notebookService: NotebookService,
		private exploreObservables: ExploreObservablesService
	) {
		this.isLoadComplete = false;
		if (data) {
			this.displayName = data.displayName;
			this.notebookService.getUserNotebooks().subscribe(
				(userNotebooks) => {
					this.userNotebooks = userNotebooks;
					this.profileService.getUserByUid(data.uid).subscribe(
						(res) => {
							this.userProfile = res.user;
							this.isLoadComplete = true;

							// eslint-disable-next-line no-underscore-dangle
							// @ts-ignore
							const milliseconds: number =
								// eslint-disable-next-line no-underscore-dangle
								res.user.dateJoined._seconds * 1000;
							// eslint-disable-next-line no-underscore-dangle
							const dateObject = new Date(milliseconds);
							this.date = dateObject.toLocaleString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							});
						},
						(err) => {
							this.isLoadComplete = true;
							this.viewProfileFailed = true;
							this.errorMessage = err.message;
						}
					);
				},
				(err) => {
					this.isLoadComplete = true;
					this.viewProfileFailed = true;
					this.errorMessage = err.message;
				}
			);
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	dismiss(): void {
		this.dialogRef.close();
	}

	viewNotebook(notebook: any): void {
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

		this.dialog.open(ExploreNoteListComponent, {
			width: screenWidth,
			height: '80%',
			data: {
				title: notebook.title,
				description: notebook.description,
			},
		});

		this.exploreObservables.setOpenExploreNotebook(
			notebook.notebookId,
			notebook.title,
			true
		);
	}
}
