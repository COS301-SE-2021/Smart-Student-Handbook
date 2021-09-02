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

		return admin
			.firestore()
			.collection('userNotes')
			.doc(noteId)
			.set({
				...createNoteDto,
				createDate: Date.now(),
				noteId,
			})
			.then(() => ({
				message: 'Successfully created note',
			}))
			.catch((error) => {
				throw new HttpException(`Could not create note. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	async updateNote(updateNoteDto: UpdateNoteDto, userId: string): Promise<Response> {
		if (!(await this.accessService.checkUserAccess(updateNoteDto.notebookId, userId))) {
			throw new HttpException(
				'User does not have access to create a new note in this notebook.',
				HttpStatus.UNAUTHORIZED,
			);
		}

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

	async getNotes(notebookId: string): Promise<Note[]> {
		const notes: Note[] = [];
		const noteSnapshot = await admin
			.firestore()
			.collection('userNotes')
			.where('notebookId', '==', notebookId)
			.get()
			.catch((error) => {
				throw new HttpException(`Could not retrieve notebook notes. ${error}`, HttpStatus.BAD_REQUEST);
			});

		noteSnapshot.forEach((note) => {
			notes.push(<Note>note.data());
		});

		return notes;
	}

	async deleteNote(noteId: string): Promise<Response> {
		await admin
			.database()
			.ref(`notebook/${noteId}`)
			.remove()
			.catch((error) => {
				throw new HttpException(`Could not remove note content in database. ${error}`, HttpStatus.BAD_REQUEST);
			});

		return await admin
			.firestore()
			.collection('userNotes')
			.doc(noteId)
			.get()
			.then(() => ({
				message: 'Successfully delete note for notebook',
			}))
			.catch((error) => {
				throw new HttpException(`Could not retrieve notebook notes. ${error}`, HttpStatus.BAD_REQUEST);
			});
	}

	async deleteAllNotes(notebookId: string) {
		const notes = await this.getNotes(notebookId);

		await notes.forEach((note: Note) => {
			this.deleteNote(note.noteId);
		});
	}
}
