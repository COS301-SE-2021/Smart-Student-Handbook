import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {
	NotebookService,
	NoteOperationsService,
	NotebookObservablesService,
} from '@app/services';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

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

	notebookTitle: '';

	constructor(
		private router: Router,
		private notesService: NoteOperationsService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService
	) {
		this.notebookObservables.openNotebookId.subscribe((notebook) => {
			if (notebook.notebookId !== '') {
				this.notebookId = notebook.notebookId;
				this.notebookTitle = notebook.title;
			}
		});

		this.exploreObservables.openExploreNotebookId.subscribe((notebook) => {
			this.notebookTitle = notebook.title;
		});
	}

	createNewNotebook() {
		this.notesService
			.createNewNote(this.notebookId, this.notebookTitle)
			.subscribe(async (data) => {
				await this.router.navigate(['notebook']);

				this.notebookObservables.setLoadEditor(
					this.notebookId,
					data.id,
					data.notebook.name,
					data.notebook.name
				);
			});
	}
}
