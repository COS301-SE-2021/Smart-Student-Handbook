import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
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
	async getUserNotebooks(): Promise<Notebook[]> {
		const userId: string = await this.getUserId();
		const notebookIds: string[] = [];
		const notebooks = [];

		try {
			const notebookIdSnapshot = await admin.firestore().collection(`userContent/${userId}/Notebooks`).get();
			notebookIdSnapshot.forEach((doc) => {
				notebookIds.push(doc.id);
			});
			// console.log('test', notebookIds);

			const notebookSnapshot = await admin
				.firestore()
				.collection('userNotebooks')
				.where('notebookId', 'in', notebookIds)
				.get();

			// console.log(notebookSnapshot);

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
			console.log('notebooks');
			console.log(notebooks);

			return notebooks;
		} catch (e) {
			throw new HttpException(`Bad Request${e}`, HttpStatus.BAD_REQUEST);
		}
	}

	async createNotebook(notebookDto: NotebookDto): Promise<Response> {
		const userId: string = await this.getUserId();
		const notebookId: string = randomStringGenerator();

		const note: Note = {
			name: 'Introduction',
			noteId: randomStringGenerator(),
		};

		const notebook: Notebook = {
			title: notebookDto.title,
			author: notebookDto.author,
			course: notebookDto.course,
			description: notebookDto.description,
			institution: notebookDto.institution,
			creatorId: notebookDto.creatorId,
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
					creatorId: notebookDto.creatorId,
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
				'Something went wrong. Operation could not be executed.',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		try {
			return await admin
				.firestore()
				.collection(`userContent/${userId}/Notebooks`)
				.doc(notebookId)
				.set({
					notebookId,
				})
				.then(() => ({
					message: 'Creating a notebook was successful!',
					notebook,
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

	async createNote(noteDto: NoteDto): Promise<Response> {
		const note: Note = {
			name: noteDto.name,
			noteId: randomStringGenerator(),
		};

		const notes: Note[] = await this.getNotes(noteDto.notebookId);
		notes.push(note);

		return this.updateNotes(noteDto.notebookId, notes);
	}

	async updateNote(noteDto: NoteDto): Promise<Response> {
		const notes: Note[] = await this.getNotes(noteDto.notebookId);

		notes.forEach((tempNote: Note) => {
			if (tempNote.noteId === noteDto.noteId) {
				// eslint-disable-next-line no-param-reassign
				tempNote.name = noteDto.name;
			}
		});

		return this.updateNotes(noteDto.notebookId, notes);
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
					message: 'Creating a notebook was successful!',
					notebookId,
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

	async getNotes(notebookId: string): Promise<Note[]> {
		try {
			const doc = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

			if (doc.exists) {
				return doc.data().notes;
			}
		} catch (e) {
			throw new HttpException(`Bad Request${e}`, HttpStatus.BAD_REQUEST);
		}
		throw new HttpException('Document Could not be found!', HttpStatus.NOT_FOUND);
	}

	async deleteNotebook(notebookId: string): Promise<Response> {
		const notes = await this.getNotes(notebookId);

		notes.forEach((note: Note) => {
			this.deleteNote({
				notebookId,
				noteId: note.noteId,
			});
		});

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

	async deleteNote(noteDto: NoteDto): Promise<Response> {
		const notes: Note[] = await this.getNotes(noteDto.notebookId);

		await admin.database().ref(`notebook/${noteDto.noteId}`).remove();

		try {
			notes.forEach((item: Note, index: number) => {
				if (item.noteId === noteDto.noteId) {
					notes.splice(index, 1);
				}
			});
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}

		await this.updateNotes(noteDto.notebookId, notes);

		return {
			message: 'Successfully delete note!',
		};
	}

	async getUserId(): Promise<string> {
		try {
			return firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}
	}

	async addNotebookReview(reviewDto: ReviewDto): Promise<Response> {
		const timestamp = new Date().getTime();
		const userId: string = await this.getUserId();

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
				`Something went wrong. Operation could not be executed.${error}`,
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
			throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebookReview(notebookId: string): Promise<Response> {
		const userId: string = await this.getUserId();

		try {
			return await admin
				.firestore()
				.collection(`userNotebooks/${notebookId}/review`)
				.doc(userId)
				.delete()
				.then(() => ({
					message: 'Deleted review was successful!',
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException('Bad Request.', HttpStatus.BAD_REQUEST);
		}
	}

	async addAccess(accessDto: AccessDto): Promise<Response> {
		const access: Access[] = await this.getAccessList(accessDto.notebookId);

		access.push({
			displayName: accessDto.displayName,
			userId: accessDto.userId,
			profileUrl: accessDto.profileUrl,
		});

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
				'Something went wrong. Operation could not be executed.',
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
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
		throw new HttpException('Document Could not be found!', HttpStatus.NOT_FOUND);
	}

	async checkUserAccess(checkAccessDto: CheckAccessDto): Promise<boolean> {
		const access: Access[] = await this.getAccessList(checkAccessDto.notebookId);
		let accessGranted = false;

		access.forEach((user: Access) => {
			if (user.userId === checkAccessDto.userId) {
				accessGranted = true;
			}
		});

		return accessGranted;
	}

	async removeUserAccess(checkAccessDto: CheckAccessDto): Promise<Response> {
		const access: Access[] = await this.getAccessList(checkAccessDto.notebookId);

		try {
			access.forEach((item: Access, index: number) => {
				if (item.userId === checkAccessDto.userId) {
					access.splice(index, 1);
				}
			});
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}

		await this.updateAccess(checkAccessDto.notebookId, access);

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
}
