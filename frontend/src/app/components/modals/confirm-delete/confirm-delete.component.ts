import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-delete',
	templateUrl: './confirm-delete.component.html',
	styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {
	constructor(private dialogRef: MatDialogRef<ConfirmDeleteComponent>) {}

	Confirm(): void {
		this.dialogRef.close(true);
	}

	Cancel(): void {
		this.dialogRef.close(false);
	}
}
