import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { NotebookService } from '@app/services';

export interface AddNoteData {
	message: string;
	title: string;
	description: string;
	tags: string[];
	notebookId: string;
	notebookTitle: string;
	userId: string;
	method: string;
	noteId: string;
}

@Component({
	selector: 'app-add-note',
	templateUrl: './add-note.component.html',
	styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent {
	doneLoading: boolean = true;

	// tags: string[] = [];

	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

	constructor(
		public dialogRef: MatDialogRef<AddNoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: AddNoteData,
		private notebookService: NotebookService
	) {
		// if (this.data.tags) this.tags = this.data.tags;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Remove a tag from input and tags array
	 * @param tag the tag to be removed
	 */
	removeTag(tag: string): void {
		const index = this.data.tags.indexOf(tag);

		if (index >= 0) {
			this.data.tags.splice(index, 1);
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
			this.data.tags.push(value);
		}

		// Clear the input value
		event.chipInput!.clear();
	}

	createNote() {
		this.doneLoading = false;

		if (this.data.method === 'create') {
			const request = {
				notebookId: this.data.notebookId,
				name: this.data.title,
				description: this.data.description,
				tags: this.data.tags,
			};

			// Call service and create notebook
			this.notebookService.createNote(request).subscribe(
				(data) => {
					const newNotebook = {
						userId: this.data.userId,
						name: request.name,
						description: request.description,
						tags: request.tags,
						noteId: data.noteId,
						notebookTitle: this.data.notebookTitle,
					};

					this.doneLoading = true;

					this.dialogRef.close({
						notebook: newNotebook,
						id: data.noteId,
					});
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			const request = {
				notebookId: this.data.notebookId,
				noteId: this.data.noteId,
				name: this.data.title,
				description: this.data.description,
				creatorId: this.data.userId,
				tags: this.data.tags,
			};

			// Call service and update notebook
			this.notebookService.updateNote(request).subscribe(
				() => {
					this.doneLoading = true;

					this.dialogRef.close({
						description: request.description,
						title: request.name,
					});
				},
				(error) => {
					console.log(error);
				}
			);
		}
	}
}
