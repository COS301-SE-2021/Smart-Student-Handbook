import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as admin from 'firebase-admin';
import { CreateNoteDto } from '../dto/createNote.dto';
import { Response } from '../interfaces/response.interface';
import { Note } from '../interfaces/note.interface';
import { AccessService } from '../access/access.service';
import { UpdateNoteDto } from '../dto/updateNote.dto';

@Injectable()
export class NoteService {
	constructor(private accessService: AccessService) {}

	/**
	 * Create a note for a notebook
	 * @param createNoteDto
	 * @param userId
	 */
	async createNote(createNoteDto: CreateNoteDto, userId: string): Promise<Response> {
		const noteId: string = randomStringGenerator();
		/**
		 * Check if user has access to create a note in this notebook.
		 */
		if (!(await this.accessService.checkUserAccess(createNoteDto.notebookId, userId))) {
			throw new HttpException(
				'User does not have access to create a new note in this notebook.',
				HttpStatus.UNAUTHORIZED,
			);
		}

		/**
		 * Add user notes to firebase
		 */
		await admin
			.firestore()
			.collection('userNotes')
			.doc(noteId)
			.set({
				...createNoteDto,
				createdDate: Date.now(),
				noteId,
			})
			.catch((error) => {
				throw new HttpException(`Could not create note. ${error}`, HttpStatus.BAD_REQUEST);
			});

		const notes = await this.getNotes(createNoteDto.notebookId);

		await this.updateNotebookNotes(createNoteDto.notebookId, notes);

		return {
			message: 'Successfully created note',
		};
	}

	/**
	 * Update notes to firebase
	 * @param updateNoteDto
	 * @param userId
	 */
	async updateNote(updateNoteDto: UpdateNoteDto, userId: string): Promise<Response> {
		/**
		 * Check if user has access to create a note in this notebook.
		 */
		if (!(await this.accessService.checkUserAccess(updateNoteDto.notebookId, userId))) {
			throw new HttpException(
				'User does not have access to create a new note in this notebook.',
				HttpStatus.UNAUTHORIZED,
			);
		}

		/**
		 * Update note in firebase
		 */
		return admin
			.firestore()
			.collection('userNotes')
			.doc(updateNoteDto.noteId)
			.update({
				...updateNoteDto,
			})
			.then(() => ({
				message: 'Successfully created note',
			}))
			.catch((error) => {
				throw new HttpException(`Could not create note. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	/**
	 * Retrieve user notes
	 * @param notebookId
	 */
	async getNotes(notebookId: string): Promise<Note[]> {
		const notes: Note[] = [];

		/**
		 * Retrieve all note for the specified note book
		 */
		const noteSnapshot = await admin
			.firestore()
			.collection('userNotes')
			.where('notebookId', '==', notebookId)
			.orderBy('createdDate', 'desc')
			.get()
			.catch((error) => {
				throw new HttpException(`Could not retrieve notebook notes. ${error}`, HttpStatus.BAD_REQUEST);
			});

		/**
		 * Add each snapshot to the notes array and return it
		 */
		noteSnapshot.forEach((note) => {
			notes.push(<Note>note.data());
		});

		return notes;
	}

	/**
	 * Delete a note from a notebook
	 * @param noteId
	 */
	async deleteNote(noteId: string): Promise<Response> {
		// TODO AUTH!!!
		/**
		 * Delete note instance in the real time data base if it exists
		 */
		await admin
			.database()
			.ref(`notebook/${noteId}`)
			.remove()
			.catch((error) => {
				throw new HttpException(`Could not remove note content in database. ${error}`, HttpStatus.BAD_REQUEST);
			});

		/**
		 * Delete note in firestore
		 */
		return await admin
			.firestore()
			.collection('userNotes')
			.doc(noteId)
			.delete()
			.then(() => ({
				message: 'Successfully delete note for notebook',
			}))
			.catch((error) => {
				throw new HttpException(`Could not retrieve notebook notes. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	/**
	 * Delete all notes in a notebook
	 * @param notebookId
	 */
	async deleteAllNotes(notebookId: string) {
		/**
		 * Retrieve all notes in the notebook
		 */
		const notes = await this.getNotes(notebookId);

		/**
		 * Delete each note one by one
		 */
		await notes.forEach((note: Note) => {
			this.deleteNote(note.noteId);
		});
	}

	/**
	 * Update the content of a notebook
	 * @param notebookId
	 * @param notes
	 */
	async updateNotebookNotes(notebookId: string, notes: Note[]): Promise<void> {
		/**
		 * Update notes in notebook on firebase.
		 */
		await admin.firestore().collection('userNotebooks').doc(notebookId).update({
			notes,
		});
	}
}
