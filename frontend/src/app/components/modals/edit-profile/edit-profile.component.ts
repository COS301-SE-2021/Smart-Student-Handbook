import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@app/models';

/**
 * Data for the add notebook popup
 */

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
	image: any;

	fileName: any;

	fileType: any;

	localUrl: any[] = [];

	date: any;

	constructor(
		public dialogRef: MatDialogRef<EditProfileComponent>,
		@Inject(MAT_DIALOG_DATA) public data: User
	) {
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

	onNoClick(): void {
		this.dialogRef.close();
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

	fileChangeEvent(event: any) {
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
	}
}
