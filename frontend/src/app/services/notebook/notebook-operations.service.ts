import { Injectable } from '@angular/core';
import { NotebookService } from '@app/services/notebook.service';
import { ProfileService } from '@app/services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { Observable } from 'rxjs';
import {
	AddCollaboratorComponent,
	AddNotebookComponent,
	ConfirmDeleteComponent,
} from '@app/components';
import { NotebookDto } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class NotebookOperationsService {
	user: any;

	title: string;

	/**
	 * A service to be used for by components all notebook operations
	 * @param notebookService
	 * @param profileService
	 * @param dialog
	 * @param notificationService
	 */
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog,
		private notificationService: NotificationService
	) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));
	}

	/**
	 * Send a collaboration request to another user
	 * to partake in a notebook
	 * @param senderId
	 * @param notebookID
	 * @param notebookTitle
	 */
	requestCollaborator(
		senderId: string,
		notebookID: string,
		notebookTitle: string
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

		const dialogRef = this.dialog.open(AddCollaboratorComponent, {
			width: screenWidth,
			data: {
				name: '',
				profileUrl: '',
				id: '',
			},
		});

		return Observable.create((observer) => {
			// observer: any
			dialogRef.afterClosed().subscribe((result) => {
				if (result) {
					this.notificationService
						.sendCollaborationRequest(
							senderId,
							result.id,
							notebookID,
							notebookTitle
						)
						.subscribe(
							() => {
								// console.log(val);
								observer.next(true);
							},
							() => {
								observer.next(false);
							}
						);
				}
			});
		});
	}

	/**
	 * Remove a user from collaborating on a notebook
	 * @param userId
	 * @param notebookID
	 */
	removeCollaborator(userId: string, notebookID: string): Observable<any> {
		const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
			data: {
				message: 'Are you sure you want to remove this user?',
			},
		});

		return Observable.create((observer: any) => {
			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				if (result === true) {
					this.notebookService
						.removeUserAccess({
							userId,
							notebookId: notebookID,
						})
						.subscribe(
							() => {
								observer.next(userId);
							},
							() => {
								observer.next(false);
							}
						);
				}
			});
		});
	}

	/**
	 * Get the information of a notebook
	 * @param notebookId
	 * @return date, notebook, tags, collaborators, creator
	 */
	getNotebookInfo(notebookId: string): Observable<any> {
		return Observable.create((observer: any) => {
			const date = 'July 18, 2021 at 14:44';
			let notebook: any;

			this.notebookService.getUserNotebooks().subscribe((notebooks) => {
				// console.log(notebooks);
				for (let i = 0; i < notebooks.length; i += 1) {
					if (notebooks[i].notebookId === notebookId) {
						notebook = notebooks[i];
						// console.log(notebooks);
					}
				}

				// Push tags
				const tags: any = [];
				for (let i = 0; i < notebook.tags.length; i += 1) {
					tags.push({ name: notebook.tags[i] });
				}

				// Get collaborator info
				const collaborators: any = [];
				for (let k = 0; k < notebook.access.length; k += 1) {
					collaborators.push({
						name: notebook.access[k].displayName,
						url: notebook.access[k].profileUrl,
						id: notebook.access[k].userId,
					});
				}

				let creator = {
					name: '',
					url: '',
					id: '',
				};
				// Get creator info
				this.profileService
					.getUserByUid(notebook.creatorId)
					.subscribe((res) => {
						creator = {
							name: res.user.username,
							url: '',
							id: res.user.uid,
						};

						observer.next({
							date,
							notebook,
							tags,
							collaborators,
							creator,
						});
					});
			});
		});
	}

	/**
	 * Create a new notebook
	 * @param notebookDto
	 * @return create notebook response
	 */
	createNewNotebook(notebookDto: NotebookDto): Observable<any> {
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

		const dialogRef = this.dialog.open(AddNotebookComponent, {
			width: screenWidth,
			data: {
				title: '',
				description: '',
				private: '',
				header: 'Create New Notebook',
			},
		});

		return Observable.create((observer: any) => {
			dialogRef.afterClosed().subscribe((result) => {
				if (result) {
					this.notebookService
						.createNotebook({
							title: result.title,
							author: notebookDto.author,
							course: result.course,
							description: result.description,
							institution: notebookDto.institution,
							creatorId: notebookDto.creatorId,
							private: result.private,
							tags: notebookDto.tags,
						})
						.subscribe((data: any) => {
							// console.log(data);
							observer.next(data);
						});
				}
			});
		});
	}

	/**
	 * Update a notebook's tags
	 * @param notebookDto
	 */
	updateNotebookTags(notebookDto: NotebookDto) {
		const dto: NotebookDto = {
			title: notebookDto.title,
			author: notebookDto.author,
			course: notebookDto.course,
			description: notebookDto.description,
			institution: notebookDto.institution,
			creatorId: notebookDto.creatorId,
			private: notebookDto.private,
			tags: notebookDto.tags,
			notebookId: notebookDto.notebookId,
		};

		return Observable.create((observer: any) => {
			this.notebookService.updateNotebook(dto).subscribe(
				() => {
					observer.next(dto);
				},
				() => observer.next(false)
			);
		});
	}

	/**
	 * Update a notebook's details
	 * @param notebookDto
	 */
	updateNotebook(notebookDto: NotebookDto): Observable<any> {
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

		const dialogRef = this.dialog.open(AddNotebookComponent, {
			width: screenWidth,
			data: {
				title: notebookDto.title,
				course: notebookDto.course,
				description: notebookDto.description,
				private: notebookDto.private,
				header: 'Update Notebook',
			},
		});

		return Observable.create((observer: any) => {
			dialogRef.afterClosed().subscribe((result) => {
				const dto: NotebookDto = {
					title: result.title,
					author: notebookDto.author,
					course: notebookDto.course,
					description: result.description,
					institution: notebookDto.institution,
					creatorId: notebookDto.creatorId,
					private: result.private,
					tags: notebookDto.tags,
					notebookId: notebookDto.notebookId,
				};

				if (result) {
					this.updateNotebookTags(dto).subscribe((notebookResult) => {
						observer.next(notebookResult);
					});
				}
			});
		});
	}
}
