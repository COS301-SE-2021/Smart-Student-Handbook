/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import {
	AfterContentInit,
	// AfterViewInit,
	Component,
	OnInit,
	ViewChild,
	// ViewEncapsulation,
} from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import {
	NotebookService,
	NoteOperationsService,
	NotebookObservablesService,
	AccountService,
} from '@app/services';

@Component({
	selector: 'app-notes-panel',
	templateUrl: './notes-panel.component.html',
	// encapsulation: ViewEncapsulation.None,
	styleUrls: ['./notes-panel.component.scss'],
})
export class NotesPanelComponent implements OnInit, AfterContentInit {
	// Variables for add notebook popup dialog
	title = '';

	// course = '';

	description = '';

	date = '';

	notebookId = '';

	// Variable that holds the logged in user details
	user: any;

	// sliding panel
	@ViewChild('sidenav') sidenav!: MatSidenav;

	open!: boolean;

	public notes: any = [];

	notebookTitle = 'Notes';

	doneLoading: boolean = true;

	creatorId: string = '';

	/**
	 * Notes panel constructor
	 * @param notebookService call notebook related requests to backend
	 * @param dialog show dialog to update notebook details
	 * @param notebookObservables
	 * @param notesService
	 * @param accountService
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private notebookObservables: NotebookObservablesService,
		private notesService: NoteOperationsService,
		private accountService: AccountService
	) {}

	ngAfterContentInit(): void {
		this.doneLoading = true;

		this.notebookObservables.openNotebookId.subscribe((val: any) => {
			if (val.title !== '') {
				this.notebookTitle = val.title;
				this.notes = [];
				this.getUserNotebooks(val.notebookId);

				// navigate to notebook if not on page
				const button = document.getElementById(
					'openNotesPanelBtn'
				) as HTMLButtonElement;
				if (button) button.click();

				this.notebookService
					.getNotebook(val.notebookId)
					.subscribe((notebook) => {
						this.creatorId = notebook.creatorId;
					});
			}
		});
	}

	/**
	 * Get the logged in user's notebooks as well as
	 * User information from localstorage
	 */
	ngOnInit(): void {
		// let userDeatils;
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.open = false;

		this.notebookObservables.closePanel.subscribe((close) => {
			if (close.close) {
				this.closePanel();
				this.notes = [];
				this.notebookObservables.setClosePanel(false);
			}
		});
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks(notebookId: string) {
		this.doneLoading = false;

		this.notebookId = notebookId;

		this.notes = [];

		this.notebookService
			.getNotes(notebookId) // this.user.uid
			.subscribe((result) => {
				// const noteHolderDiv = document.getElementById('noteHolderDiv');

				for (let i = 0; i < result.length; i += 1) {
					this.notes.push(result[i]);
				}

				this.doneLoading = true;
			});
	}

	openPanelBtn() {
		if (this.notes.length > 0) {
			this.openPanel();
		}
	}

	/**
	 * Open and close or hide and show the panel
	 */
	public openPanel() {
		this.open = true;
		const sideNavContainer = document.getElementById(
			'notes-container'
		) as HTMLElement;
		const col = sideNavContainer?.parentElement?.parentElement;

		sideNavContainer.style.width = '100%';

		if (col) {
			col.style.width = '16.6666666667%';
			col.style.minWidth = '250px';
		}
	}

	closePanel() {
		this.open = false;

		const sideNavContainer = document.getElementById(
			'notes-container'
		) as HTMLElement;
		const col = sideNavContainer?.parentElement?.parentElement;

		sideNavContainer.style.width = '40px';

		if (col) {
			col.style.width = '40px';
			col.style.minWidth = '0px';
		}
	}

	/**
	 * Used in notebook component to open a specific notebook
	 * @param _noteBookId
	 * @param _noteId
	 * @param _title
	 * @param _notebookTitle
	 * @param _description
	 * @param _tags
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	openNotebook(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_noteBookId: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_noteId: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_title: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_notebookTitle: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_description: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_tags: string[]
	) {}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 * @param title
	 * @param description
	 * @param tags
	 */
	editNotebook(
		id: string,
		title: string,
		description: string,
		tags: string[]
	) {
		this.notesService
			.editNote(
				this.notebookId,
				id,
				title,
				description,
				this.creatorId,
				tags
			)
			.subscribe((newNote: { description: any; title: any }) => {
				this.notes = this.notes.map((notebook: any) => {
					if (notebook.noteId === id) {
						notebook.description = newNote.description;
						notebook.name = newNote.title;
					}

					return notebook;
				});
			});
	}

	/**
	 * Create a new note
	 */
	createNewNote() {
		this.notesService
			.createNewNote(this.notebookId, this.notebookTitle)
			.subscribe((newNote) => {
				this.notes.push(newNote.notebook);

				this.openNotebook(
					this.notebookId,
					newNote.id,
					newNote.notebook.name,
					this.notebookTitle,
					newNote.notebook.description,
					newNote.notebook.tags
				);
			});
	}

	/**
	 * Delete a note
	 * @param noteId
	 */
	deleteNote(noteId: string) {
		this.notesService
			.removeNote(this.notebookId, noteId)
			.subscribe((removed: any) => {
				if (removed) {
					this.removeNote(noteId);
				}
			});
	}

	/**
	 * Remove the notebook from the view
	 * (The notebook is deleted in the editor component)
	 * @param id the id of the notebook to be removed
	 */
	removeNote(id: string) {
		// eslint-disable-next-line array-callback-return
		this.notes = this.notes.filter((notebook: any) => {
			if (notebook.noteId !== id) {
				return notebook;
			}
		});
	}
}
