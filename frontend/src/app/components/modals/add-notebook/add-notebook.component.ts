import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

/**
 * Data for the add notebook popup
 */
export interface DialogData {
	title: string;
	description: string;
	course: string;
	private: boolean;
	header: string;
	tags: string[];
}

@Component({
	selector: 'app-add-notebook',
	templateUrl: './add-notebook.component.html',
	styleUrls: ['./add-notebook.component.scss'],
})
export class AddNotebookComponent {
	tags: string[] = [];

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	constructor(
		public dialogRef: MatDialogRef<AddNotebookComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {
		if (!this.data.private) this.data.private = false;

		if (this.data.tags) this.tags = this.data.tags;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Remove a tag from input and tags array
	 * @param tag the tag to be removed
	 */
	removeTag(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	/**
	 * Insert new tags to the input and tags array
	 * @param event To get the value from the newly inserted tag
	 */
	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.tags.push(value);
		}

		// Clear the input value
		event.chipInput!.clear();
	}
}
