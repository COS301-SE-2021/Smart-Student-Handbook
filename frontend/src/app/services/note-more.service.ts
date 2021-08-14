import { Injectable } from '@angular/core';
import { AddCollaboratorComponent } from '@app/components/modals/add-collaborator/add-collaborator.component';
import { AddNotebookComponent, ConfirmDeleteComponent } from '@app/components';
import { ProfileService } from '@app/services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '@app/services/notebook.service';
import { Observable } from 'rxjs';
import { NotebookDto } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class NoteMoreService {
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog,
		private notificationService: NotebookService
	) {}

	addCollaborator(notebookID: string): Observable<any> {
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

		return Observable.create((observer: any) => {
			dialogRef.afterClosed().subscribe((result) => {
				this.notebookService
					.addAccess({
						displayName: result.name,
						userId: result.id,
						profileUrl: result.profileUrl,
						notebookId: notebookID,
					})
					.subscribe(() => {
						observer.next({
							name: result.name,
							url: result.profileUrl,
							id: result.id,
						});
					});
			});
		});
	}

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
						.subscribe(() => {
							observer.next(userId);
							// this.collaborators = this.collaborators.filter(
							//   (collaborator) => collaborator.id !== userId
							// );
						});
				}
			});
		});
	}

	getNotebookInfo(notebookId: string): Observable<any> {
		return Observable.create((observer: any) => {
			const date = 'July 18, 2021 at 14:44';
			let notebook: any;

			this.notebookService.getUserNotebooks().subscribe((notebooks) => {
				for (let i = 0; i < notebooks.length; i += 1) {
					if (notebooks[i].notebookId === notebookId)
						notebook = notebooks[i];
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
					.getUserDetails(notebook.creatorId)
					.subscribe((res) => {
						creator = {
							name: res.userInfo.name,
							url: '',
							id: res.userInfo.uid,
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

	updateNotebookTags(notebookDto: NotebookDto) {
		this.notebookService
			.updateNotebook({
				title: notebookDto.title,
				author: notebookDto.author,
				course: notebookDto.course,
				description: notebookDto.description,
				institution: notebookDto.institution,
				creatorId: notebookDto.creatorId,
				private: notebookDto.private,
				tags: notebookDto.tags,
				notebookId: notebookDto.notebookId,
			})
			.subscribe(() => {
				// console.log(res);
			});
	}

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
				if (result) {
					this.notebookService
						.updateNotebook({
							title: result.title,
							author: notebookDto.author,
							course: notebookDto.course,
							description: result.description,
							institution: notebookDto.institution,
							creatorId: notebookDto.creatorId,
							private: result.private,
							tags: notebookDto.tags,
							notebookId: notebookDto.notebookId,
						})
						.subscribe(() => {
							observer.next({
								title: result.title,
								author: notebookDto.author,
								course: result.course,
								description: result.description,
								institution: notebookDto.institution,
								creatorId: notebookDto.creatorId,
								private: result.private,
								tags: notebookDto.tags,
								notebookId: notebookDto.notebookId,
							});
						});
				}
			});
		});
	}
}
