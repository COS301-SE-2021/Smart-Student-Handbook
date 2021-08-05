import { Injectable } from '@angular/core';
import { AddNotebookComponent, ConfirmDeleteComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '@app/services/notebook.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotesService {
	// Variables for add notebook popup dialog
	title = '';

	course = '';

	description = '';

	institution = '';

	private = false;

	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog
	) {}

	/**
	 * Create a new notebook
	 */
	createNewNotebook(userName: string, uid: string): Observable<any> {
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
			const dialogRef = this.dialog.open(AddNotebookComponent, {
				width: screenWidth,
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
						author: userName,
						course: result.course,
						description: result.description,
						institution: result.institution,
						name: userName,
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
								userId: uid,
							};

							// this.notebooks.push(newNotebook);
							observer.next({
								notebook: newNotebook,
								id: data.notebookId,
							});

							// this.openNotebook(data.notebookId);
						},
						(error) => {
							console.log(error);
							// this.LeftMenuComponent.getUserNotebooks();
						}
					);
				}

				return null;
			});
		});
	}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 */
	editNotebook(id: string): Observable<any> {
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
			// Get the notebook info to edit
			this.notebookService.getNoteBookById(id).subscribe((result) => {
				this.title = result.title;
				this.course = result.course;
				this.description = result.description;
				this.institution = result.institution;
				this.private = result.private;

				// Open dialog
				const dialogRef = this.dialog.open(AddNotebookComponent, {
					width: screenWidth,
					data: {
						title: this.title,
						course: this.course,
						description: this.description,
						institution: this.institution,
						private: this.private,
					},
				});

				// Get info and update notebook after dialog is closed
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
						this.notebookService
							.updateNotebook(request, id)
							.subscribe(
								() => {
									observer.next({
										course: request.course,
										description: request.description,
										institution: request.institution,
										private: request.private,
										title: request.title,
									});
								},
								(error) => {
									console.log(error);
								}
							);
					}
				});
			});
		});
	}

	/**
	 * Delete a notebook
	 */
	removeNotebook(notebookID: string): Observable<any> {
		return Observable.create((observer: any) => {
			const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
				// width: '50%',
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				if (result === true) {
					if (notebookID !== '') {
						this.notebookService
							.removeNotebook(notebookID)
							.subscribe(
								() => {
									observer.next(true);
								},
								(error) => {
									console.log(error);
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
