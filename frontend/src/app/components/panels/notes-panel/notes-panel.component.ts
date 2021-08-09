/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService, OpenNotebookPanelService } from '@app/services';
import { AddNotebookComponent } from '@app/components';
import { MatSidenav } from '@angular/material/sidenav';
import { NotesService } from '@app/services/notes.service';

@Component({
	selector: 'app-notes-panel',
	templateUrl: './notes-panel.component.html',
	encapsulation: ViewEncapsulation.None,
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

	/**
	 * Notes panel constructor
	 * @param notebookService call notebook related requests to backend
	 * @param dialog show dialog to update notebook details
	 * @param openNotebookPanelService
	 * @param notesService
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private openNotebookPanelService: OpenNotebookPanelService,
		private notesService: NotesService
	) {}

	/**
	 * Get the logged in user's notebooks as well as
	 * User information from localstorage
	 */
	ngOnInit(): void {
		// let userDeatils;
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		// this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
		// this.profile = this.profile.userInfo;

		this.open = false;

		// Toggle the notePanelComponent when in desktop view and notebook is selected
		if (this.openNotebookPanelService.toggleSubscribe === undefined) {
			this.openNotebookPanelService.toggleSubscribe =
				this.openNotebookPanelService.togglePanelEmitter.subscribe(
					(notebookId) => {
						this.notes = [];
						this.getUserNotebooks(notebookId);

						// navigate to notebook if not on page
						const button = document.getElementById(
							'openNotesPanelBtn'
						) as HTMLButtonElement;
						if (button) button.click();
					}
				);
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
			col.style.width = 'fit-content';
			col.style.minWidth = '0px';
		}
	}

	/**
	 * Used in notebook component to open a specific notebook
	 * @param _id the id of the notebook to be opened
	 * @param _title
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	openNotebook(_id: string, _title: string) {}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 */
	editNotebook(id: string) {
		// Get the notebook info to edit

		// Open dialog
		const dialogRef = this.dialog.open(AddNotebookComponent, {
			width: '50%',
			data: {
				title: this.title,
				description: this.description,
			},
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((data) => {
			// If the user filled out the form
			if (data !== undefined) {
				const request = {
					notebookId: this.notebookId,
					noteId: id,
					name: this.title,
					description: this.description,
				};

				// Call service and update notebook
				this.notebookService.updateNote(request).subscribe(
					() => {
						this.notes = this.notes.map((notebook: any) => {
							if (notebook.notebookReference === id) {
								notebook.description = request.description;
								notebook.title = request.name;
							}

							return notebook;
						});
					},
					(error) => {
						console.log(error);
					}
				);
			}
		});
	}

	/**
	 * Create a new notebook
	 */
	createNewNotebook() {
		// Open dialog
		const dialogRef = this.dialog.open(AddNotebookComponent, {
			width: '50%',
			data: {
				title: this.title,
				description: this.description,
			},
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((result) => {
			// If the user filled out the form
			if (result !== undefined) {
				// Create request object
				const request = {
					notebookId: this.notebookId,
					name: result.title,
					description: result.description,
				};

				console.log(request);
				// this.notebookTitle = result.title;

				// Call service and create notebook
				this.notebookService.createNote(request).subscribe(
					(data) => {
						const newNotebook = {
							name: request.name,
							description: request.description,
							notebookReference: data.noteId,
						};

						this.notes.push(newNotebook);

						this.openNotebook(data.noteId, result.title);
					},
					(error) => {
						console.log(error);
						// this.LeftMenuComponent.getUserNotebooks();
					}
				);
			}
		});
	}

	/**
	 * Remove the notebook from the view
	 * (The notebook is deleted in the editor component)
	 * @param id the id of the notebook to be removed
	 */
	removeNotebook(id: string) {
		// eslint-disable-next-line array-callback-return
		this.notes = this.notes.filter((notebook: any) => {
			if (notebook.notebookReference !== id) {
				return notebook;
			}
		});
	}
}
