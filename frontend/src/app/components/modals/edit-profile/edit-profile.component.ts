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
import { map, startWith } from 'rxjs/operators';
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

	constructor(
		public dialogRef: MatDialogRef<EditProfileComponent>,
		@Inject(MAT_DIALOG_DATA) public data: User,
		private accountService: AccountService,
		private dialog: MatDialog,
		private router: Router
	) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));

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

	ngOnInit() {
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
		const progressbar = document.getElementById(
			'progressbar'
		) as HTMLElement;
		if (progressbar) progressbar.style.display = 'block';
		this.isDisabled = true;
		this.updatedFailed = false;

		if (this.data !== undefined && this.user) {
			this.accountService
				.updateUser(
					this.user.uid,
					this.data.displayName,
					this.data.institution,
					this.data.department,
					this.data.program,
					this.data.workStatus,
					this.data.bio,
					this.data.profilePicUrl
				)
				.subscribe(
					(res: any) => {
						if (res.success) {
							this.dialogRef.close();
						} else {
							this.errorMessage = res.message;
							this.updatedFailed = true;
						}
						if (progressbar) progressbar.style.display = 'none';
						this.isDisabled = false;
					},
					(err) => {
						console.log(`Error: ${err.error.message}`);
					}
				);
		}
	}

	deleteAccount(): void {
		const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
			data: {
				message:
					"Are you sure you want to delete your account. This action can't be reversed",
			},
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((result) => {
			if (result === true && this.user) {
				this.accountService.deleteUser(this.user.uid).subscribe(
					(res: any) => {
						const confirm = this.dialog.open(MessageComponent, {
							data: {
								title: 'Successfully Deleted',
								message1: res.message,
								message2: '',
							},
						});
						confirm.afterClosed().subscribe(() => {
							this.dialogRef.close();
							this.router.navigate(['account/login']);
						});
					},
					(error) => {
						this.errorMessage = error.message;
						this.updatedFailed = true;
					}
				);
			}
		});
	}

	imagePreview(e: any) {
		// @ts-ignore
		const file = (e.target as HTMLInputElement).files[0];

		const reader = new FileReader();
		reader.onload = () => {
			this.imgFilePath = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	//---------------------------------------------------------

	// public imagePath: any;
	//
	// imgURL: any;
	//
	// public message: string;
	//
	// preview(files) {
	// 	if (files.length === 0) return;
	//
	// 	const mimeType = files[0].type;
	// 	if (mimeType.match(/image\/*/) == null) {
	// 		this.message = 'Only images are supported.';
	// 		return;
	// 	}
	//
	// 	const reader = new FileReader();
	// 	this.imagePath = files;
	// 	reader.readAsDataURL(files[0]);
	// 	reader.onload = (_event) => {
	// 		this.imgURL = reader.result;
	// 	};
	// }

	//---------------------------------------------------------

	// fileChangeEvent(event: any) {
	// if (event.target.files && event.target.files[0]) {
	// 	const reader = new FileReader();
	// 	reader.onload = (e: any) => {
	// 		this.localUrl = e.target.result;
	// 	};
	// 	reader.readAsDataURL(event.target.files[0]);
	// 	console.log(this.localUrl);
	// }
	// console.log(event);
	// const element = event.currentTarget as HTMLInputElement;
	// const fileList: FileList | null = element.files;
	// if (fileList) {
	// 	console.log('FileUpload -> files', fileList);
	// 	// eslint-disable-next-line prefer-destructuring
	// 	this.fileName = fileList[0];
	// 	this.fileType = this.fileName.type;
	// 	this.image = document.getElementById('some_id') as HTMLImageElement;
	// 	this.image.src = URL.createObjectURL(this.fileName);
	// }
	// }
}
