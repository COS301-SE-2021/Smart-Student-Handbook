import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import firebase from 'firebase';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Notebook } from './interfaces/notebook.interface';
import { Review } from './interfaces/review.interface';
import { NotebookDto } from './dto/notebook.dto';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
import { NoteDto } from './dto/note.dto';
import { ReviewDto } from './dto/review.dto';
import { AccessDto } from './dto/access.dto';
import { Access } from './interfaces/access.interface';
import { CheckAccessDto } from './dto/checkAccess.dto';

require('firebase/auth');

@Injectable()
export class NotebookService {
	async getUserNotebooks(userId: string): Promise<Notebook[]> {
		// const userId: string = await this.getUserId(token);
		const notebookIds: string[] = [];
		const notebooks = [];

		try {
			const notebookIdSnapshot = await admin.firestore().collection(`userContent/${userId}/Notebooks`).get();
			notebookIdSnapshot.forEach((doc) => {
				notebookIds.push(doc.id);
			});

			if (notebookIds.length === 0) {
				return notebooks;
			}

			const notebookSnapshot = await admin
				.firestore()
				.collection('userNotebooks')
				.where('notebookId', 'in', notebookIds)
				.get();

			notebookSnapshot.forEach((doc) => {
				notebooks.push({
					title: doc.data().title,
					author: doc.data().author,
					course: doc.data().course,
					description: doc.data().description,
					institution: doc.data().institution,
					creatorId: doc.data().creatorId,
					private: doc.data().private,
					notebookId: doc.data().notebookId,
					notes: doc.data().notes,
					access: doc.data().access,
					tags: doc.data().tags,
				});
			});

			return notebooks;
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async getNotebook(notebookId: string): Promise<Notebook> {
		try {
			const notebook = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

			return {
				title: notebook.data().title,
				author: notebook.data().author,
				course: notebook.data().course,
				description: notebook.data().description,
				institution: notebook.data().institution,
				creatorId: notebook.data().creatorId,
				private: notebook.data().private,
				notebookId: notebook.data().notebookId,
				notes: notebook.data().notes,
				access: notebook.data().access,
				tags: notebook.data().tags,
			};
		} catch (e) {
			throw new HttpException(
				'Could net retrieve notebook, it could be that the notebook does not exist',
				HttpStatus.NOT_FOUND,
			);
		}
	}

	async createNotebook(notebookDto: NotebookDto): Promise<Response> {
		const { creatorId } = notebookDto; // await this.getUserId();
		const notebookId: string = randomStringGenerator();

		const note: Note = {
			name: 'Introduction',
			noteId: randomStringGenerator(),
			description: 'My first note',
			createDate: Date.now(),
		};

		const notebook: Notebook = {
			title: notebookDto.title,
			author: notebookDto.author,
			course: notebookDto.course,
			description: notebookDto.description,
			institution: notebookDto.institution,
			creatorId,
			private: notebookDto.private,
			tags: notebookDto.tags,
			notebookId,
			notes: [note],
			access: [],
		};

		try {
			await admin
				.firestore()
				.collection('userNotebooks')
				.doc(notebookId)
				.set({
					title: notebookDto.title,
					author: notebookDto.author,
					course: notebookDto.course,
					description: notebookDto.description,
					institution: notebookDto.institution,
					creatorId,
					private: notebookDto.private,
					tags: notebookDto.tags,
					notebookId,
					notes: [note],
					access: [],
				})
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed. ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		const response = await this.addNotebookToUser(notebookId, creatorId);

		if (response.message === 'Successfully added notebook to user account') {
			return {
				message: 'Successfully added notebook to user account',
				notebook,
			};
		}

		throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);
	}

	async addNotebookToUser(notebookId: string, userId: string): Promise<Response> {
		try {
			return await admin
				.firestore()
				.collection(`userContent/${userId}/Notebooks`)
				.doc(notebookId)
				.set({
					notebookId,
				})
				.then(() => ({
					message: 'Successfully added notebook to user account',
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				'Something went wrong. Operation could not be executed.',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateNotebook(notebookDto: NotebookDto): Promise<Response> {
		const { creatorId } = notebookDto; // await this.getUserId();
		const authorized = await this.checkCreator(notebookDto.notebookId, creatorId);

		if (!authorized) {
			throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		}

		try {
			return await admin
				.firestore()
				.collection('userNotebooks')
				.doc(notebookDto.notebookId)
				.update({
					title: notebookDto.title,
					author: notebookDto.author,
					course: notebookDto.course,
					description: notebookDto.description,
					institution: notebookDto.institution,
					private: notebookDto.private,
					tags: notebookDto.tags,
				})
				.then(() => ({
					message: 'Updated notebook successful!',
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				'Something went wrong. Operation could not be executed.',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteUserNotebook(notebookId: string, userId: string): Promise<void> {
		try {
			await admin.firestore().collection(`userContent/${userId}/Notebooks`).doc(notebookId).delete();
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebook(notebookId: string, userId: string): Promise<Response> {
		// const userId = await this.getUserId();
		const authorized = await this.checkCreator(notebookId, userId);

		if (!authorized) {
			throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		}

		const notes = await this.getNotes(notebookId);

		await notes.forEach((note: Note) => {
			this.deleteNote({
				notebookId,
				noteId: note.noteId,
			});
		});

		await this.deleteUserNotebook(notebookId, userId);

		return admin
			.firestore()
			.collection('userNotebooks')
			.doc(notebookId)
			.delete()
			.then(() => ({
				message: 'Successfully delete notebook!',
			}))
			.catch(() => {
				throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
			});
	}

	async createNote(noteDto: NoteDto): Promise<Response> {
		const { userId } = noteDto; // await this.getUserId();
		const authorized = await this.checkUserAccess({ notebookId: noteDto.notebookId, userId });

		if (!authorized) {
			throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		}

		const note: Note = {
			name: noteDto.name,
			description: noteDto.description,
			noteId: randomStringGenerator(),
			createDate: Date.now(),
		};

		const notes: Note[] = await this.getNotes(noteDto.notebookId);
		notes.push(note);

		await this.updateNotes(noteDto.notebookId, notes);

		return {
			message: 'Creating a note was successful!',
			noteId: note.noteId,
		};
	}

	async updateNote(noteDto: NoteDto): Promise<Response> {
		const { userId } = noteDto; // await this.getUserId();
		const authorized = await this.checkUserAccess({ notebookId: noteDto.notebookId, userId });

		if (!authorized) {
			throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		}

		const notes: Note[] = await this.getNotes(noteDto.notebookId);

		notes.forEach((tempNote: Note) => {
			if (tempNote.noteId === noteDto.noteId) {
				// eslint-disable-next-line no-param-reassign
				tempNote.name = noteDto.name;
				// eslint-disable-next-line no-param-reassign
				tempNote.description = noteDto.description;
			}
		});

		await this.updateNotes(noteDto.notebookId, notes);

		return {
			message: 'Update a note successfully!',
		};
	}

	async updateNotes(notebookId: string, notes: Note[]): Promise<Response> {
		try {
			return await admin
				.firestore()
				.collection('userNotebooks')
				.doc(notebookId)
				.update({
					notes,
				})
				.then(() => ({
					message: 'Update a notebook was successful!',
					notebookId,
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed error. ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getNotes(notebookId: string): Promise<Note[]> {
		const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

		if (doc.exists) {
			return doc.data().notes;
		}

		throw new HttpException('Documents does not seem to exist.', HttpStatus.NOT_FOUND);
	}

	async deleteNote(noteDto: NoteDto): Promise<Response> {
		// const userId = await this.getUserId();
		// const authorized = await this.checkUserAccess({ notebookId: noteDto.notebookId, userId });
		let updatedNotebook = false;
		// if (!authorized) {
		// 	throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		// }

		const notes: Note[] = await this.getNotes(noteDto.notebookId);

		try {
			await admin.database().ref(`notebook/${noteDto.noteId}`).remove();
		} catch (e) {
			throw new HttpException('Firebase could not remove document.', HttpStatus.BAD_REQUEST);
		}

		notes.forEach((item: Note, index: number) => {
			if (item.noteId === noteDto.noteId) {
				notes.splice(index, 1);
				updatedNotebook = true;
			}
		});
		if (!updatedNotebook) {
			throw new HttpException('Note could not be found!', HttpStatus.BAD_REQUEST);
		}

		try {
			await this.updateNotes(noteDto.notebookId, notes);
		} catch (e) {
			throw new HttpException('Firebase could not update document.', HttpStatus.BAD_REQUEST);
		}

		return {
			message: 'Successfully delete note!',
		};
	}

	async addNotebookReview(reviewDto: ReviewDto): Promise<Response> {
		const timestamp = new Date().getTime();
		const { userId } = reviewDto; // await this.getUserId();

		try {
			return await admin
				.firestore()
				.collection(`userNotebooks/${reviewDto.notebookId}/review`)
				.doc(userId)
				.set({
					message: reviewDto.message,
					rating: reviewDto.rating,
					displayName: reviewDto.displayName,
					profileUrl: reviewDto.profileUrl,
					userId,
					timestamp,
				})
				.then(() => ({
					message: 'Successfully added a review!',
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				'Something went wrong. Operation could not be executed.',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getNotebookReviews(notebookId: string): Promise<Review[]> {
		const reviews = [];

		try {
			const snapshot = await admin
				.firestore()
				.collection(`userNotebooks/${notebookId}/review`)
				.orderBy('timestamp', 'asc')
				.limit(15)
				.get();

			snapshot.forEach((doc) => {
				reviews.push({
					message: doc.data().message,
					rating: doc.data().rating,
					displayName: doc.data().displayName,
					userId: doc.data().userId,
					profileUrl: doc.data().profileUrl,
					timestamp: doc.data().timestamp,
				});
			});

			return reviews;
		} catch (error) {
			throw new HttpException('Could not retrieve notebook reviews', HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebookReview(notebookId: string, userId: string): Promise<Response> {
		// const userId: string = await this.getUserId();

		try {
			return await admin
				.firestore()
				.collection(`userNotebooks/${notebookId}/review`)
				.doc(userId)
				.delete()
				.then(() => ({
					message: 'Deleted review successfully!',
				}))
				.catch(() => {
					throw new HttpException('Notebook Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException('Could note delete notebook review.', HttpStatus.BAD_REQUEST);
		}
	}

	async addAccess(accessDto: AccessDto): Promise<Response> {
		const access: Access[] = await this.getAccessList(accessDto.notebookId);

		access.push({
			displayName: accessDto.displayName,
			userId: accessDto.userId,
			profileUrl: accessDto.profileUrl,
		});

		await this.addNotebookToUser(accessDto.notebookId, accessDto.userId);

		return this.updateAccess(accessDto.notebookId, access);
	}

	async updateAccess(notebookId: string, access: Access[]): Promise<Response> {
		try {
			return await admin
				.firestore()
				.collection('userNotebooks')
				.doc(notebookId)
				.update({
					access,
				})
				.then(() => ({
					message: 'Successfully added use to access list!',
					notebookId,
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed.${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getAccessList(notebookId: string): Promise<Access[]> {
		try {
			const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

			if (doc.exists) {
				return doc.data().access;
			}
		} catch (e) {
			throw new HttpException('Could not complete firebase request.', HttpStatus.BAD_REQUEST);
		}
		throw new HttpException('Document Could not be found!', HttpStatus.NOT_FOUND);
	}

	async checkUserAccess(checkAccessDto: CheckAccessDto): Promise<boolean> {
		const { userId } = checkAccessDto; // await this.getUserId();
		const access: Access[] = await this.getAccessList(checkAccessDto.notebookId);
		let accessGranted = false;
		const creator: boolean = await this.checkCreator(checkAccessDto.notebookId, userId);

		if (creator) {
			return true;
		}

		access.forEach((user: Access) => {
			if (user.userId === userId) {
				accessGranted = true;
			}
		});

		return accessGranted;
	}

	async removeUserAccess(checkAccessDto: CheckAccessDto): Promise<Response> {
		const { userId } = checkAccessDto; // await this.getUserId();
		let { creatorId } = checkAccessDto;
		// TODO Fix if statement(TEMPORARLY SUCH THAT SYSTEM DOES NOT BREAK)
		if (!creatorId) {
			creatorId = userId;
		}
		const authorized = await this.checkCreator(checkAccessDto.notebookId, creatorId);

		if (!authorized) {
			throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
		}

		const access: Access[] = await this.getAccessList(checkAccessDto.notebookId);

		try {
			access.forEach((item: Access, index: number) => {
				if (item.userId === userId) {
					access.splice(index, 1);
				}
			});
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}

		await this.updateAccess(checkAccessDto.notebookId, access);

		await this.deleteUserNotebook(checkAccessDto.notebookId, checkAccessDto.userId);

		return {
			message: 'Successfully removed user from access list!',
		};
	}

	async checkCreator(notebookId: string, userId: string): Promise<boolean> {
		try {
			const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

			if (doc.exists) {
				if (doc.data().creatorId === userId) {
					return true;
				}
			}
			return false;
		} catch (e) {
			throw new HttpException(`Bad Request${e}`, HttpStatus.BAD_REQUEST);
		}
	}

	// async getUserId(): Promise<string> {
	// 	try {
	// 		return firebase.auth().currentUser.uid;
	// 	} catch (error) {
	// 		throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
	// 	}
	// }
}
