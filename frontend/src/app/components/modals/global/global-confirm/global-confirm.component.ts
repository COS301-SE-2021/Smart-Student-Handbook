import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// global confirm Dialog that can be used to confirm users actions

@Component({
	selector: 'app-global-confirm',
	templateUrl: './global-confirm.component.html',
	styleUrls: ['./global-confirm.component.scss'],
})
export class GlobalConfirmComponent {
	constructor(private dialogRef: MatDialogRef<GlobalConfirmComponent>) {}

	Confirm(): void {
		this.dialogRef.close(true);
	}

	Cancel(): void {
		this.dialogRef.close(false);
	}
}
