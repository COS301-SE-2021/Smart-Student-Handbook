import { Injectable } from '@angular/core';
import { CloneNoteComponent, ConfirmDeleteComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '@app/services/notebook.service';
import { Observable } from 'rxjs';
import { AddNoteComponent } from '@app/components/modals/add-note/add-note.component';
import { AccountService, ProfileService } from '@app/services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class NoteOperationsService {
	// Variables for add notebook popup dialog
	title = '';

	course = '';

	description = '';

	institution = '';

	private = false;

	user: any;

	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private profileService: ProfileService,
		private snackBar: MatSnackBar,
		private accountService: AccountService
	) {
		// Behavioral subject
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	/**
	 * Create a new notebook
	 */
	createNewNote(notebookId: string, notebookTitle: string): Observable<any> {
		return new Observable((observer: any) => {
			const screenWidth = this.getScreenSize();

			// Open dialog
			const dialogRef = this.dialog.open(AddNoteComponent, {
				width: screenWidth,
				data: {
					title: this.title,
					message: 'Create New Note',
					description: this.description,
					notebookId,
					notebookTitle,
					userId: this.user.id,
					method: 'create',
				},
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				// If the user filled out the form
				if (result !== undefined) {
					observer.next(result);
				}
			});
		});
	}

	/**
	 * Edit the details of a notebook
	 * @param notebookId
	 * @param noteId
	 * @param title
	 * @param description
	 * @param creatorId
	 * @param tags
	 */
	editNote(
		notebookId: string,
		noteId: string,
		title: string,
		description: string,
		creatorId: string,
		tags: string[]
	): Observable<any> {
		const screenWidth = this.getScreenSize();

		return new Observable((observer: any) => {
			// Open dialog
			const dialogRef = this.dialog.open(AddNoteComponent, {
				width: screenWidth,
				data: {
					title,
					message: 'Update Note',
					description,
					tags,
					noteId,
					notebookId,
					notebookTitle: '',
					userId: creatorId,
					method: 'update',
				},
			});

			// Get info and update notebook after dialog is closed
			dialogRef.afterClosed().subscribe((data) => {
				// If the user filled out the form
				if (data !== undefined) {
					observer.next(data);
				}
			});
		});
	}

	/**
	 * Delete a notebook
	 */
	removeNote(notebookID: string, noteId: string): Observable<any> {
		return Observable.create((observer: any) => {
			const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
				data: {
					message: 'Are you sure you want to delete this notebook?',
				},
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				if (result === true) {
					if (notebookID !== '') {
						this.notebookService
							.deleteNote(notebookID, noteId)
							.subscribe(
								() => {
									observer.next(true);
								},
								() => {
									observer.next(false);
									// console.log(error);
								}
							);
					}
				} else {
					observer.next(false);
				}
			});
		});
	}

	/**
	 * Clone a note and it's contents
	 */
	cloneNote(options: any[]) {
		let screenWidth = '65%';
		if (window.innerWidth <= 576) {
			screenWidth = '100%';
		}

		// Open dialog
		const dialogRef = this.dialog.open(CloneNoteComponent, {
			width: screenWidth,
			hasBackdrop: false,
			data: {
				options,
			},
		});

		return new Observable((observer) => {
			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe(
				({ notebookId, title, description, tags }) => {
					if (
						notebookId !== undefined &&
						title !== undefined &&
						description !== undefined
					) {
						// console.log(notebookId, title, description);

						const request = {
							tags,
							notebookId,
							name: title,
							description,
						};

						this.notebookService.createNote(request).subscribe(
							(newNote) => {
								// console.log(newNote);

								if (newNote.noteId) {
									this.snackBar.open(
										'Note successfully cloned!',
										'',
										{
											duration: 2000,
										}
									);
									observer.next(newNote.noteId);
								} else {
									observer.next(false);
								}
							},
							() => {
								observer.next(false);
							}
						);
					} else {
						observer.next(false);
					}
				},
				() => {
					observer.next(false);
				}
			);
		});
	}

	getUserNotebooks() {
		// Get the users notebooks
		return new Observable((observable) => {
			const options: any[] = [];
			this.notebookService
				.getUserNotebooks()
				.subscribe((notebooks: any[]) => {
					notebooks.forEach((notebook) => {
						options.push({
							title: notebook.title,
							notebookId: notebook.notebookId,
						});
					});

					observable.next(options);
				});
		});
	}

	/**
	 * If the current device is mobile, make the modals width 100%, otherwise 50%
	 */
	getScreenSize(): string {
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			return '100%';
		}
		return '80%';
	}
}
