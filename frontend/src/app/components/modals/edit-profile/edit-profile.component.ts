import { Component, Inject, OnInit } from '@angular/core';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialog,
} from '@angular/material/dialog';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import { ConfirmDeleteComponent, MessageComponent } from '@app/components';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { institutions } from './InstitutionsList';

/**
 * Data for the add notebook popup
 */

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
	image: any;

	fileName: any;

	fileType: any;

	localUrl: any[] = [];

	date: any;

	isDisabled: boolean = false;

	updatedFailed: boolean = false;

	errorMessage: string = '';

	myControl = new FormControl();

	options: string[] = institutions;

	filteredOptions: Observable<string[]> | undefined;

	imgFilePath: string = '../../../../assets/images/defaultProfile.jpg';

	user: any;

	doneLoading: boolean = true;

	fb;

	downloadURL: Observable<string>;

	event: any = null;

	constructor(
		public dialogRef: MatDialogRef<EditProfileComponent>,
		@Inject(MAT_DIALOG_DATA) public data: User,
		private accountService: AccountService,
		private dialog: MatDialog,
		private router: Router,
		private storage: AngularFireStorage
	) {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
				this.imgFilePath = user.profilePic;
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

	ngOnInit() {
		this.doneLoading = true;

		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map((value) => this.filter(value))
		);
	}

	private filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) =>
			option.toLowerCase().includes(filterValue)
		);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		this.doneLoading = false;
		this.isDisabled = true;
		this.updatedFailed = false;

		if (this.event) {
			const n = Date.now();
			const file = this.event.files[0];
			const filePath = `UserProfilePictures/${this.user.uid}${n}`;
			const fileRef = this.storage.ref(filePath);
			const task = this.storage.upload(
				`UserProfilePictures/${this.user.uid}${n}`,
				file
			);
			task.snapshotChanges()
				.pipe(
					finalize(() => {
						this.downloadURL = fileRef.getDownloadURL();
						this.downloadURL.subscribe((url) => {
							if (url) {
								this.fb = url;

								console.log(url);

								const updatedUser: User = this.user;
								updatedUser.profilePic = this.fb;

								if (this.data !== undefined && this.user) {
									this.accountService
										.updateUser(
											this.data.displayName,
											this.data.institution,
											this.data.department,
											this.data.program,
											this.data.workStatus,
											this.data.bio,
											updatedUser.profilePic
										)
										.subscribe(
											(res: any) => {
												if (res.success) {
													this.dialogRef.close();
													this.accountService.userSubject.next(
														updatedUser
													);
												} else {
													this.errorMessage =
														res.message;
													this.updatedFailed = true;
												}
												this.doneLoading = true;
												this.isDisabled = false;
											},
											(err) => {
												this.doneLoading = true;
												console.log(
													`Error: ${err.error.message}`
												);
											}
										);
								}
							}
						});
					})
				)
				.subscribe((url) => {
					if (url) {
						// console.log(url);
					}
				});
		} else if (this.data !== undefined && this.user) {
			this.accountService
				.updateUser(
					this.data.displayName,
					this.data.institution,
					this.data.department,
					this.data.program,
					this.data.workStatus,
					this.data.bio,
					this.data.profilePic
				)
				.subscribe(
					(res: any) => {
						if (res.success) {
							this.dialogRef.close();
						} else {
							this.errorMessage = res.message;
							this.updatedFailed = true;
						}
						this.doneLoading = true;
						this.isDisabled = false;
					},
					(err) => {
						this.doneLoading = true;
						console.log(`Error: ${err.error.message}`);
					}
				);
		}
	}

	deleteAccount(): void {
		this.doneLoading = false;

		const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
			data: {
				message:
					"Are you sure you want to delete your account. This action can't be reversed",
			},
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((result) => {
			if (result === true && this.user) {
				this.accountService.deleteUser().subscribe(
					(res: any) => {
						const confirm = this.dialog.open(MessageComponent, {
							data: {
								title: 'Successfully Deleted',
								message1: res.message,
								message2: '',
							},
						});
						confirm.afterClosed().subscribe(() => {
							this.doneLoading = true;
							this.dialogRef.close();
							this.router.navigate(['account/login']);
						});
						this.doneLoading = true;
					},
					(error) => {
						this.doneLoading = true;
						this.errorMessage = error.message;
						this.updatedFailed = true;
					}
				);
			} else this.doneLoading = true;
		});
	}

	imagePreview(imageInput: any) {
		this.event = imageInput;
		const file: File = imageInput.files[0];
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			this.imgFilePath = reader.result as string;
		});

		reader.readAsDataURL(file);
	}
}
