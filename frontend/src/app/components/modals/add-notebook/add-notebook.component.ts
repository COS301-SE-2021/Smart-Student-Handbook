import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Data for the add notebook popup
 */
export interface DialogData {
	title: string;
	description: string;
	course: string;
	private: boolean;
	header: string;
}

@Component({
	selector: 'app-add-notebook',
	templateUrl: './add-notebook.component.html',
	styleUrls: ['./add-notebook.component.scss'],
})
export class AddNotebookComponent {
	constructor(
		public dialogRef: MatDialogRef<AddNotebookComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {
		// eslint-disable-next-line no-param-reassign
		if (!data.private) data.private = false;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
