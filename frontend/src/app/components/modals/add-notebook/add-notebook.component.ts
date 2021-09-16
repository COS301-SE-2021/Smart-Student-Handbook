import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotebookService } from '@app/services';
import { NotebookDto } from '@app/models';

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
	author: string;
	institution: string;
	notebookId: string;
}

@Component({
	selector: 'app-add-notebook',
	templateUrl: './add-notebook.component.html',
	styleUrls: ['./add-notebook.component.scss'],
})
export class AddNotebookComponent {
	tags: string[] = [];

	doneLoading: boolean = true;

	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

	constructor(
		public dialogRef: MatDialogRef<AddNotebookComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private notebookService: NotebookService
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

	addNotebook() {
		this.doneLoading = false;

		if (this.data.header === 'Create New Notebook') {
			this.notebookService
				.createNotebook({
					title: this.data.title,
					author: this.data.author,
					course: this.data.course,
					description: this.data.description,
					institution: this.data.institution,
					private: this.data.private,
					tags: this.data.tags,
				})
				.subscribe((data: any) => {
					this.doneLoading = true;
					if (data) this.dialogRef.close(data);
					else this.dialogRef.close(false);
				});
		} else {
			const dto: NotebookDto = {
				title: this.data.title,
				author: this.data.author,
				course: this.data.course,
				description: this.data.description,
				institution: this.data.institution,
				private: this.data.private,
				tags: this.data.tags,
				notebookId: this.data.notebookId,
			};

			this.notebookService.updateNotebook(dto).subscribe(
				() => {
					this.dialogRef.close(dto);
				},
				() => {
					this.dialogRef.close(false);
				}
			);
		}
	}
}
