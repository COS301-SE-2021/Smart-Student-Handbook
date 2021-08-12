import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface AddNoteData {
	message: string;
	title: string;
	description: string;
}

@Component({
	selector: 'app-add-note',
	templateUrl: './add-note.component.html',
	styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent {
	constructor(
		public dialogRef: MatDialogRef<AddNoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: AddNoteData
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
