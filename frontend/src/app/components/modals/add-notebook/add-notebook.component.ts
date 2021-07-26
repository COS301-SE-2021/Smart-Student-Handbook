import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Data for the add notebook popup
 */
export interface DialogData {
	title: string;
	course: string;
	description: string;
	institution: string;
	private: boolean;
}

@Component({
	selector: 'app-add-notebook',
	templateUrl: './add-notebook.component.html',
	styleUrls: ['./add-notebook.component.scss'],
})
export class AddNotebookComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<AddNotebookComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {}

	ngOnInit(): void {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
