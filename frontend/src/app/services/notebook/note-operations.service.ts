import { Injectable } from '@angular/core';
import {
	AddCollaboratorComponent,
	AddNotebookComponent,
	ConfirmDeleteComponent,
} from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '@app/services/notebook.service';
import { Observable } from 'rxjs';
import { AddNoteComponent } from '@app/components/modals/add-note/add-note.component';
import { NotificationService, ProfileService } from '@app/services';
import { NotebookDto } from '@app/models';

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
		private notificationService: NotificationService
	) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));
	}

	/**
	 * Create a new notebook
	 */
	createNewNote(notebookId: string): Observable<any> {
		let screenWidth = '';
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		return Observable.create((observer: any) => {
			// Open dialog
			const dialogRef = this.dialog.open(AddNoteComponent, {
				width: screenWidth,
				data: {
					title: this.title,
					message: 'Create New Note',
					description: this.description,
				},
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				// If the user filled out the form
				if (result !== undefined) {
					// Create request object
					const request = {
						userId: this.user.uid,
						notebookId,
						name: result.title,
						description: result.description,
					};

					// console.log(request);
					// this.notebookTitle = result.title;

					// Call service and create notebook
					this.notebookService.createNote(request).subscribe(
						(data) => {
							const newNotebook = {
								userId: this.user.id,
								name: request.name,
								description: request.description,
								noteId: data.noteId,
							};

							observer.next({
								notebook: newNotebook,
								id: data.noteId,
							});
						},
						(error) => {
							console.log(error);
							// this.LeftMenuComponent.getUserNotebooks();
						}
					);
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
	 */
	editNote(
		notebookId: string,
		noteId: string,
		title: string,
		description: string
	): Observable<any> {
		let screenWidth = '';
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		return Observable.create((observer: any) => {
			// Open dialog
			const dialogRef = this.dialog.open(AddNoteComponent, {
				width: screenWidth,
				data: {
					title,
					message: 'Update Note',
					description,
				},
			});

			// Get info and update notebook after dialog is closed
			dialogRef.afterClosed().subscribe((data) => {
				// If the user filled out the form
				if (data !== undefined) {
					const request = {
						notebookId,
						noteId,
						name: data.title,
						description: data.description,
						userId: this.user.uid,
					};

					// Call service and update notebook
					this.notebookService.updateNote(request).subscribe(
						() => {
							observer.next({
								description: request.description,
								title: request.name,
							});
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
}
