import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeleteData {
	message: string;
}

@Component({
	selector: 'app-confirm-delete',
	templateUrl: './confirm-delete.component.html',
	styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {
	constructor(
		private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DeleteData
	) {}

	Confirm(): void {
		this.dialogRef.close(true);
	}

	Cancel(): void {
		this.dialogRef.close(false);
	}
}
