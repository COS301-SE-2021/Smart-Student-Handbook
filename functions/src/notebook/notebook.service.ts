import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Notebook } from './interfaces/notebook.interface';
import { NotebookDto } from './dto/notebook.dto';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
import { NoteDto } from './dto/note.dto';

require('firebase/auth');

@Injectable()
export class NotebookService {
	/**
	 * Find all the notebooks of the currently logged in user
	 */
	async findAllUserNotebooks(): Promise<Notebook[]> {
		let userId = '';
		const notebooks = [];

		// Try to find logged in users id else throw and exception
		try {
			userId = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				'Unable to complete request. User might not be signed in.',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Connect to firebase and retrieve all records with a matching uid
		const notebookRef = admin
			.firestore()
			.collection('notebooks')
			.where('userId', '==', userId);
		const snapshot = await notebookRef.get();
		snapshot.forEach((doc) => {
			const notebookTemp: Notebook = {
				title: doc.data().title,
				author: doc.data().author,
				course: doc.data().course,
				description: doc.data().description,
				institution: doc.data().institution,
				name: doc.data().name,
				private: doc.data().private,
				notebookReference: doc.data().notebookReference,
			};
			notebooks.push(notebookTemp);
		});

		return notebooks;
	}

	/**
	 * Find notebook corresponding to the notebookId
	 * @param notebookId
	 */
	async findNotebookById(notebookId: string): Promise<Notebook> {
		// Connect to firebase and retrieve notebook with the provided notebookId
		const doc = await admin
			.firestore()
			.collection('notebooks')
			.doc(notebookId)
			.get();

		// Return document if the document exists or else throw and exception
		if (doc.exists) {
			return {
				title: doc.data().title,
				author: doc.data().author,
				course: doc.data().course,
				description: doc.data().description,
				institution: doc.data().institution,
				name: doc.data().name,
				private: doc.data().private,
				notebookReference: doc.data().notebookReference,
			};
		}

		throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
	}

	/**
	 * Create or Update a notebook
	 * @param notebookDto
	 * @param notebookId
	 */
	async createOrUpdateNotebook(
		notebookDto: NotebookDto,
		notebookId: string,
	): Promise<Response> {
		// Assume the user wants to update the notebook
		let userId = '';
		let operationType = 'Update';

		// Try to find logged in users id else throw and exception
		try {
			userId = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				'Unable to complete request. User might not be signed in.',
				HttpStatus.BAD_REQUEST,
			);
		}

		// If the notebookId is null, we know the user wants to create a new notebook
		if (!notebookId) {
			notebookId = randomStringGenerator();
			operationType = 'Create';
		}

		/**
		 * Try to createOrUpdate notebook on firebase. If try fails throw internal error exception.
		 * If successful return success message else throw not found exception.
		 */
		try {
			return await admin
				.firestore()
				.collection('notebooks')
				.doc(notebookId)
				.set({
					title: notebookDto.title,
					author: notebookDto.author,
					course: notebookDto.course,
					description: notebookDto.description,
					institution: notebookDto.institution,
					name: notebookDto.name,
					private: notebookDto.private,
					notebookReference: notebookId,
				})
				.then(() => ({
					message: `${operationType} was successful!`,
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

	/**
	 * Delete notebook corresponding notebookId
	 * @param notebookId
	 */
	async deleteNotebook(notebookId: string): Promise<Response> {
		/**
		 * Connect to firebase and delete try to delete notebook. If successful return success message else
		 * throw bad request exception
		 */
		return admin
			.firestore()
			.collection('notebooks')
			.doc(notebookId)
			.delete()
			.then(() => {
				// Remove notebook from realtime database
				const notebookRef = firebase.database().ref(`notebook/${notebookId}`);
				notebookRef.remove();

				return {
					message: 'Notebook successfully delete',
				};
			})
			.catch((error) => {
				throw new HttpException(
					`Error removing document: ${error}`,
					HttpStatus.BAD_REQUEST,
				);
			});
	}

	async createNotebook(notebookDto: NotebookDto): Promise<Response> {
		// Assume the user wants to update the notebook
		let userId = '';
		const notebookId: string = randomStringGenerator();

		// Try to find logged in users id else throw and exception
		try {
			userId = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				'Unable to complete request. User might not be signed in.',
				HttpStatus.BAD_REQUEST,
			);
		}

		/**
		 * Try to createOrUpdate notebook on firebase. If try fails throw internal error exception.
		 * If successful return success message else throw not found exception.
		 */
		const note: Note = {
			name: 'Introduction',
			noteReference: randomStringGenerator(),
		};

		try {
			await admin
				.firestore()
				.collection(`notebookInfo/${userId}/Notebooks`)
				.doc(notebookId)
				.set({
					title: notebookDto.title,
					author: notebookDto.author,
					course: notebookDto.course,
					description: notebookDto.description,
					institution: notebookDto.institution,
					name: notebookDto.name,
					private: notebookDto.private,
					notebookReference: notebookId,
					userId,
					notes: [note],
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

		try {
			return await admin
				.firestore()
				.collection(`notebookInfo/${userId}/Notebooks`)
				.doc(notebookId)
				.update({
					notes: [note, note],
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

	async createNote(noteDto: NoteDto): Promise<Response> {
		const note: Note = {
			name: noteDto.name,
			noteReference: randomStringGenerator(),
		};

		const notes: Note[] = await this.getNotes(noteDto);
		notes.push(note);

		return this.updateNotes(noteDto.notebookReference, notes);
	}

	async updateNote(noteDto: NoteDto): Promise<Response> {
		const note: Note = {
			name: noteDto.name,
			noteReference: randomStringGenerator(),
		};

		const notes: Note[] = await this.getNotes(noteDto);

		notes.forEach((tempNote: Note) => {
			if (tempNote.noteReference === noteDto.noteReference) {
				// eslint-disable-next-line no-param-reassign
				tempNote.name = noteDto.name;
			}
		});

		return this.updateNotes(noteDto.notebookReference, notes);
	}

	async updateNotes(
		notebookReference: string,
		notes: Note[],
	): Promise<Response> {
		// Assume the user wants to update the notebook
		let userId = '';
		const notebookId: string = randomStringGenerator();

		try {
			userId = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				'Unable to complete request. User might not be signed in.',
				HttpStatus.BAD_REQUEST,
			);
		}

		try {
			return await admin
				.firestore()
				.collection(`notebookInfo/${userId}/Notebooks`)
				.doc(notebookReference)
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

	async getNotes(noteDto: NoteDto): Promise<Note[]> {
		let userId = '';

		try {
			userId = firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException(
				'Unable to complete request. User might not be signed in.',
				HttpStatus.BAD_REQUEST,
			);
		}

		try {
			const doc = await admin
				.firestore()
				.collection(`notebookInfo/${userId}/Notebooks`)
				.doc(noteDto.notebookReference)
				.get();

			// Return document if the document exists or else throw and exception
			if (doc.exists) {
				return doc.data().notes;
			}

			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}
}
