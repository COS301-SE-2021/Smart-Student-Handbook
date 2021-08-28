import {
	AfterContentInit,
	AfterViewInit,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
	NotebookObservablesService,
	NotebookService,
	NoteOperationsService,
} from '@app/services';
import {
	ExploreNoteListComponent,
	ExploreNotesEditorComponent,
} from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ExploreNotesEditorBottomSheetComponent } from '@app/components/modals/explore-notes-editor-bottom-sheet/explore-notes-editor-bottom-sheet.component';
import { ExploreObservablesService } from '@app/services/notebook/explore-observables.service';

@Component({
	selector: 'app-note-cards',
	templateUrl: './note-cards.component.html',
	styleUrls: ['./note-cards.component.scss'],
})
export class NoteCardsComponent implements OnInit {
	colours = [
		{
			colour: 'linear-gradient(to bottom right, rgb(233, 97, 124), rgb(231, 7, 52))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(134, 172, 173), rgb(8, 193, 199))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(133, 173, 133), rgb(71, 218, 71))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(253, 210, 130), rgb(255, 174, 24))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(202, 117, 117), rgb(190, 49, 49))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(133, 133, 255), rgb(72, 72, 255))',
		},
	];

	// Variable that holds the logged in user details
	user: any;

	notes: any = [];

	notebookId: string = '';

	readonly: boolean = false;

	isCompleted: boolean = false;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private bottomSheet: MatBottomSheet,
		private notesService: NoteOperationsService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService
	) {}

	ngOnInit(): void {
		this.notes = [];

		this.isCompleted = false;
		// get userDetails;
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.exploreObservables.openExploreNotebookId.subscribe((notebook) => {
			this.readonly = notebook.readonly;
			this.isCompleted = false;

			if (notebook.notebookId !== '') {
				this.notebookId = notebook.notebookId;
				this.getUserNotebooks();
			}
		});

		// this.notebookObservables.openNotebookId.subscribe((notebook) => {
		// 	this.readonly = notebook.readonly;
		// 	this.isCompleted = false;
		//
		// 	if (notebook.notebookId !== '') {
		// 		this.notebookId = notebook.notebookId;
		// 		this.getUserNotebooks();
		// 	}
		// });
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks() {
		this.notes = [];

		if (this.notebookId !== null) {
			this.notebookService
				.getNotes(this.notebookId) // this.user.uid
				.subscribe((result) => {
					this.notes = [];

					for (let i = 0; i < result.length; i += 1) {
						this.notes.push(result[i]);
					}
					this.isCompleted = true;
				});
		}
	}

	async openNote(noteId: string, title: string) {
		await this.router.navigate(['notebook']);

		this.notebookObservables.setLoadEditor(
			this.notebookId,
			noteId,
			title,
			this.readonly
		);
	}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 * @param title
	 * @param description
	 */
	editNote(id: string, title: string, description: string) {
		this.notesService
			.editNote(this.notebookId, id, title, description)
			.subscribe((data) => {
				if (data) {
					this.notes = this.notes.map((note: any) => {
						if (note.noteId === id) {
							note.description = data.description;
							note.name = data.title;
						}

						return note;
					});
				}
			});
	}

	deleteNote(id: string) {
		this.notesService
			.removeNote(this.notebookId, id)
			.subscribe((removed) => {
				if (removed) {
					this.notes = this.notes.filter((notebook: any) => {
						if (notebook.noteId !== id) {
							return notebook;
						}
					});
				}
			});
	}

	openNoteModal(noteId: string, title: string) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(ExploreNotesEditorBottomSheetComponent, {
				data: {
					title,
					noteId,
					user: this.user,
				},
			});
		} else {
			this.dialog.open(ExploreNotesEditorComponent, {
				width: '100%',
				height: '80%',
				data: {
					title,
					noteId,
					user: this.user,
				},
			});
		}
	}
}
