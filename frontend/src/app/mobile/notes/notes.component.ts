import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {
	NotebookService,
	NoteOperationsService,
	NotebookObservablesService,
} from '@app/services';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
	// Variable that holds the logged in user details
	user: any;

	notes: any = [];

	notebookId: string = '';

	constructor(
		private router: Router,
		private notesService: NoteOperationsService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService
	) {
		this.notebookObservables.openNotebookId.subscribe((notebook) => {
			if (notebook.notebookId !== '') {
				this.notebookId = notebook.notebookId;
			}
		});
	}

	createNewNotebook() {
		this.notesService
			.createNewNote(this.notebookId)
			.subscribe(async (data) => {
				await this.router.navigate(['notebook']);

				console.log('ADD EDITOR');
				this.notebookObservables.setLoadEditor(
					this.notebookId,
					data.id,
					data.notebook.name,
					false
				);
			});
	}
}
