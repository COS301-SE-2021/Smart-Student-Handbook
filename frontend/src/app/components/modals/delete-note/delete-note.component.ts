import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotebookService } from '@app/services';

interface DeleteNoteData {
	message: string;
	noteId: string;
	notebookId: string;
	type: string;
	userId: string;
}

@Component({
	selector: 'app-delete-note',
	templateUrl: './delete-note.component.html',
	styleUrls: ['./delete-note.component.scss'],
})
export class DeleteNoteComponent {
	doneLoading: boolean = true;

	constructor(
		private dialogRef: MatDialogRef<DeleteNoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DeleteNoteData,
		private notebookService: NotebookService
	) {}

	Confirm(): void {
		this.doneLoading = false;
		if (this.data.type === 'note') {
			this.notebookService
				.deleteNote(this.data.notebookId, this.data.noteId)
				.subscribe(
					() => {
						this.doneLoading = true;
						this.dialogRef.close(true);
					},
					() => {
						this.doneLoading = true;
						this.dialogRef.close(false);
					}
				);
		} else if (this.data.type === 'notebook') {
			this.notebookService.deleteNotebook(this.data.notebookId).subscribe(
				() => {
					this.doneLoading = true;
					this.dialogRef.close(true);
				},
				() => {
					this.doneLoading = true;
					this.dialogRef.close(false);
				}
			);
		} else if (this.data.type === 'collaborator') {
			this.notebookService
				.removeUserAccess({
					userId: this.data.userId,
					notebookId: this.data.notebookId,
				})
				.subscribe(
					() => {
						this.doneLoading = true;
						this.dialogRef.close(true);
					},
					() => {
						this.doneLoading = true;
						this.dialogRef.close(false);
					}
				);
		}
	}

	Cancel(): void {
		this.dialogRef.close(false);
	}
}
