/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService, OpenNotebookPanelService } from '@app/services';
import { AddNotebookComponent } from '@app/components';
import { MatSidenav } from '@angular/material/sidenav';
import { NotesService } from '@app/services/notes.service';

@Component({
	selector: 'app-notes-panel',
	templateUrl: './notes-panel.component.html',
	styleUrls: ['./notes-panel.component.scss'],
})
export class NotesPanelComponent implements OnInit {
	// Variables for add notebook popup dialog
	title = '';

	course = '';

	description = '';

	institution = '';

	private = false;

	// Variable that holds the logged in user details
	user: any;

	profile: any;

	// sliding panel
	@ViewChild('sidenav') sidenav!: MatSidenav;

	open!: boolean;

	public notebooks: any = [];

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
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
		this.profile = this.profile.userInfo;

		this.getUserNotebooks();

		this.open = false;

		// Toggle the notePanelComponent when in desktop view and notebook is selected
		if (this.openNotebookPanelService.toggleSubscribe === undefined) {
			this.openNotebookPanelService.toggleSubscribe =
				this.openNotebookPanelService.togglePanelEmitter.subscribe(
					() => {
						// navigate to notebook if not on page
						const button = document.getElementById(
							'openPanelBtn'
						) as HTMLButtonElement;
						if (button) button.click();
					}
				);
		}
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks() {
		this.notebooks = [];

		this.notebookService
			.getUserNotebooks() // this.user.uid
			.subscribe((result) => {
				for (let i = 0; i < result.length; i += 1) {
					this.notebooks.push(result[i]);
				}
			});
	}

	/**
	 * Open and close or hide and show the panel
	 */
	public openedCloseToggle() {
		this.open = !this.open;
		const sideNavContainer = document.getElementById(
			'notes-container'
		) as HTMLElement;
		const col = sideNavContainer?.parentElement?.parentElement;

		if (sideNavContainer.style.width === '100%') {
			sideNavContainer.style.width = '40px';

			if (col) {
				col.style.width = 'fit-content';
				col.style.minWidth = '0px';
			}
		} else {
			sideNavContainer.style.width = '100%';

			if (col) {
				col.style.width = '16.6666666667%';
				col.style.minWidth = '250px';
			}
		}
		// this.sidenav.toggle();
	}

	/**
	 * Used in notebook component to open a specific notebook
	 * @param _id the id of the notebook to be opened
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	openNotebook(_id: string) {}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 */
	editNotebook(id: string) {
		this.notesService.editNotebook(id).subscribe((data) => {
			if (data) {
				this.notebooks = this.notebooks.map((notebook: any) => {
					if (notebook.notebookReference === id) {
						notebook.course = data.course;
						notebook.description = data.description;
						notebook.institution = data.institution;
						notebook.private = data.private;
						notebook.title = data.title;
					}

					return notebook;
				});
			}
		});
	}

	/**
	 * Create a new notebook
	 */
	createNewNotebook() {
		this.notesService
			.createNewNotebook(this.profile.name, this.user.uid)
			.subscribe((data) => {
				if (data) {
					this.notebooks.push(data.notebook);
					this.openNotebook(data.id);
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
		this.notebooks = this.notebooks.filter((notebook: any) => {
			if (notebook.notebookReference !== id) {
				return notebook;
			}
		});
	}
}
