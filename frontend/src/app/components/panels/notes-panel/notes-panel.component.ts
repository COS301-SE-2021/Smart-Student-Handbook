/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import {
	NotebookService,
	OpenNotebookPanelService,
	NotesService,
} from '@app/services';
import { NotebookDataService } from '@app/services/notebookData.service';

@Component({
	selector: 'app-notes-panel',
	templateUrl: './notes-panel.component.html',
	// encapsulation: ViewEncapsulation.None,
	styleUrls: ['./notes-panel.component.scss'],
})
export class NotesPanelComponent implements OnInit {
	// Variables for add notebook popup dialog
	title = '';

	// course = '';

	description = '';

	date = '';

	notebookId = '';

	// institution = '';

	// private = false;

	// Variable that holds the logged in user details
	user: any;

	// sliding panel
	@ViewChild('sidenav') sidenav!: MatSidenav;

	open!: boolean;

	public notes: any = [];

	notebookTitle = 'Notes';

	/**
	 * Notes panel constructor
	 * @param notebookService call notebook related requests to backend
	 * @param dialog show dialog to update notebook details
	 * @param notebookData
	 * @param openNotebookPanelService
	 * @param notesService
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private notebookData: NotebookDataService,
		private openNotebookPanelService: OpenNotebookPanelService,
		private notesService: NotesService
	) {}

	/**
	 * Get the logged in user's notebooks as well as
	 * User information from localstorage
	 */
	ngOnInit(): void {
		this.notebookData.ids.subscribe((val: any) => {
			if (val.title !== '') {
				this.notebookTitle = val.title;
				this.notes = [];
				this.getUserNotebooks(val.notebookId);

				// navigate to notebook if not on page
				const button = document.getElementById(
					'openNotesPanelBtn'
				) as HTMLButtonElement;
				if (button) button.click();
			}
		});
		// }

		// let userDeatils;
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		// this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
		// this.profile = this.profile.userInfo;

		this.open = false;

		// Toggle the notePanelComponent when in desktop view and notebook is selected
		if (this.openNotebookPanelService.toggleSubscribe === undefined) {
			this.openNotebookPanelService.closePanelEmitter.subscribe(() => {
				this.closePanel();
				this.notes = [];
			});
		}
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks(notebookId: string) {
		this.notebookId = notebookId;

		this.notes = [];

		const progressbar = document.getElementById(
			'notesProgressbar'
		) as HTMLElement;

		if (progressbar) progressbar.style.display = 'block';

		this.notebookService
			.getNotes(notebookId) // this.user.uid
			.subscribe((result) => {
				// const noteHolderDiv = document.getElementById('noteHolderDiv');

				for (let i = 0; i < result.length; i += 1) {
					this.notes.push(result[i]);
				}

				if (progressbar) progressbar.style.display = 'none';
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
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	openNotebook(_noteBookId: string, _noteId: string, _title: string) {}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 * @param title
	 * @param description
	 */
	editNotebook(id: string, title: string, description: string) {
		this.notesService
			.editNote(this.notebookId, id, title, description)
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
	 * Create a new notebook
	 */
	createNewNote() {
		this.notesService
			.createNewNote(this.notebookId)
			.subscribe((newNote) => {
				this.notes.push(newNote.notebook);

				this.openNotebook(
					this.notebookId,
					newNote.id,
					newNote.notebook.name
				);
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
