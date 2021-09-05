import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tag } from '@app/components';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface AddNoteData {
	message: string;
	title: string;
	description: string;
	tags: string[];
}

@Component({
	selector: 'app-add-note',
	templateUrl: './add-note.component.html',
	styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent {
	tags: string[] = [];

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	constructor(
		public dialogRef: MatDialogRef<AddNoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: AddNoteData
	) {
		this.tags = this.data.tags;
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
