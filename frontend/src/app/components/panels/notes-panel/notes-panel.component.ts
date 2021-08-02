/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '@app/services';
import { AddNotebookComponent } from '@app/components';

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

	open = false;

	public notebooks: any = [];

	/**
	 * Notes panel constructor
	 * @param notebookService call notebook related requests to backend
	 * @param dialog show dialog to update notebook details
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog
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
		this.sidenav.toggle();

		this.open = true;

		// console.log(this.open);

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
	}

	/**
	 * Used in notebookcomponent to open a specific nptebook
	 * @param _id the id of the notebook to be opened
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	openNotebook(_id: string) {}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 */
	editNotebook(id: string) {
		// Get the notebook info to edit
		this.notebookService.getNoteBookById(id).subscribe((result) => {
			this.title = result.title;
			this.course = result.course;
			this.description = result.description;
			this.institution = result.institution;
			this.private = result.private;

			// Open dialog
			const dialogRef = this.dialog.open(AddNotebookComponent, {
				width: '50%',
				data: {
					title: this.title,
					course: this.course,
					description: this.description,
					institution: this.institution,
					private: this.private,
				},
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((data) => {
				// If the user filled out the form
				if (data !== undefined) {
					const request = {
						title: data.title,
						author: 'Arno',
						course: data.course,
						description: data.description,
						institution: data.institution,
						name: 'Arno',
						surname: 'Moller',
						private: data.private,
						username: 'userArno',
					};

					// Call service and update notebook
					this.notebookService.updateNotebook(request, id).subscribe(
						() => {
							this.notebooks = this.notebooks.map(
								(notebook: any) => {
									if (notebook.notebookReference === id) {
										notebook.course = request.course;
										notebook.description =
											request.description;
										notebook.institution =
											request.institution;
										notebook.private = request.private;
										notebook.title = request.title;
									}

									return notebook;
								}
							);
						},
						(error) => {
							console.log(error);
						}
					);
				}
			});
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
				course: this.course,
				description: this.description,
				institution: this.institution,
				private: this.private,
			},
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((result) => {
			// If the user filled out the form
			if (result !== undefined) {
				// Create request object
				const request = {
					title: result.title,
					author: this.profile.name,
					course: result.course,
					description: result.description,
					institution: result.institution,
					name: this.profile.name,
					private: result.private,
				};

				// this.notebookTitle = result.title;

				// Call service and create notebook
				this.notebookService.createNotebook(request).subscribe(
					(data) => {
						const newNotebook = {
							author: request.author,
							course: request.course,
							description: request.description,
							institution: request.institution,
							name: request.name,
							notebookReference: data.notebookId,
							private: request.private,
							title: request.title,
							userId: this.user.uid,
						};

						this.notebooks.push(newNotebook);

						this.openNotebook(data.notebookId);
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
		this.notebooks = this.notebooks.filter((notebook: any) => {
			if (notebook.notebookReference !== id) {
				return notebook;
			}
		});
	}
}
