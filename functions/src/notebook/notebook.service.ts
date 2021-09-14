import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Notebook } from './interfaces/notebook.interface';
import { Response } from './interfaces/response.interface';
import { CreateNotebookDto } from './dto/createNotebook.dto';
import { UpdateNotebookDto } from './dto/updateNotebook.dto';
import { AccessService } from './access/access.service';
import { NoteService } from './note/note.service';
import { UserService } from '../user/user.service';

require('firebase/auth');

@Injectable()
export class NotebookService {
	/**
	 * Services required by the notebook service
	 * @param accessService
	 * @param noteService
	 * @param userService
	 */
	constructor(
		private accessService: AccessService,
		private noteService: NoteService,
		private userService: UserService,
	) {}

	/**
	 * Create a new notebook for a user
	 * @param createNotebookDto
	 * @param userId
	 */
	async createNotebook(createNotebookDto: CreateNotebookDto, userId: string): Promise<Response> {
		/**
		 * Generate a unique notebookId
		 * Retrieve user object
		 */
		const notebookId: string = randomStringGenerator();
		const user = await this.userService.getUserByUid(userId);

		/**
		 * Create notebook instance to be saved and to be returned
		 */
		const notebook: Notebook = {
			...createNotebookDto,
			creatorId: userId,
			notebookId,
		};

		/**
		 * Save notebook to firebase
		 */
		await admin
			.firestore()
			.collection('userNotebooks')
			.doc(notebookId)
			.set({
				...notebook,
			})
			.catch((error) => {
				throw new HttpException(`Could not create new notebook. ${error}`, HttpStatus.BAD_REQUEST);
			});

		/**
		 * Add Access to the current notebook.
		 */
		await this.accessService.addAccess(
			{
				displayName: user.user.displayName,
				userId,
				profileUrl: user.user.displayName,
				notebookId,
			},
			userId,
		);

		/**
		 * Create first note in the notebook
		 */
		await this.noteService.createNote(
			{
				name: 'Introduction',
				description: 'My first note',
				notebookId,
				tags: [],
			},
			userId,
		);

		/**
		 * Get access and notes
		 */
		const access = await this.accessService.getAccessList(notebookId);
		const notes = await this.noteService.getNotes(notebookId);

		/**
		 * Return notebook instance
		 */
		return {
			message: 'Successfully create new notebook',
			notebook: {
				...notebook,
				access,
				notes,
			},
		};
	}

	/**
	 * Returns all the notebooks that a user has access to
	 * @param userId
	 */
	async getUserNotebooks(userId: string): Promise<Notebook[]> {
		const notebookIds: string[] = [];
		const notebooks = [];

		/**
		 * Finds the all notebookId's that a user has access to
		 */
		const notebookIdSnapshot = await admin
			.firestore()
			.collection('notebookAccess')
			.where('userId', '==', userId)
			.get()
			.catch((error) => {
				throw new HttpException(`Could not get user notebooks. ${error}`, HttpStatus.BAD_REQUEST);
			});

		notebookIdSnapshot.forEach((doc) => {
			notebookIds.push(doc.data().notebookId);
		});

		/**
		 * Returns an empty array if the user has access to 0 notebooks
		 */
		if (notebookIds.length === 0) {
			return notebooks;
		}

		/**
		 * Retrieve a firebase snapshot all the notebooks that a user has access to
		 */
		const notebookSnapshot = await admin
			.firestore()
			.collection('userNotebooks')
			.where('notebookId', 'in', notebookIds)
			.get();

		/**
		 * Add all the snapshot's notebooks into the notebook array to return to the user
		 */
		notebookSnapshot.forEach((notebook) => {
			notebooks.push({
				...notebook.data(),
			});
		});

		return notebooks;
	}

	/**
	 * Returns a specific notebook
	 * @param notebookId
	 */
	async getNotebook(notebookId: string): Promise<FirebaseFirestore.DocumentData> {
		/**
		 * Find notebook by Id
		 */
		const notebook = await admin.firestore().collection('userNotebooks').doc(notebookId).get();

		/**
		 * If notebook does not exist throw exception else return notebook
		 */
		if (!notebook.exists) {
			throw new HttpException(
				'Could net retrieve notebook, it could be that the notebook does not exist',
				HttpStatus.NOT_FOUND,
			);
		}

		return notebook.data();
	}

	/**
	 * Update the content of a notebook
	 * @param updateNotebookDto
	 * @param userId
	 */
	async updateNotebook(updateNotebookDto: UpdateNotebookDto, userId: string): Promise<Response> {
		let testId = userId;
		if (updateNotebookDto.creatorId) {
			testId = updateNotebookDto.creatorId;
		}
		/**
		 * Check if a user has access to edit the current notebook. If a user does not have access to edit the
		 * current notebook throw an Unauthorized exception
		 */
		if (!(await this.accessService.checkCreator(updateNotebookDto.notebookId, testId))) {
			throw new HttpException('User is not authorized to update this notebook.', HttpStatus.UNAUTHORIZED);
		}

		/**
		 * Update notebook on firebase.
		 */
		return admin
			.firestore()
			.collection('userNotebooks')
			.doc(updateNotebookDto.notebookId)
			.update({
				...updateNotebookDto,
			})
			.then(() => ({
				message: 'Updated notebook successful!',
			}));
	}

	/**
	 * Delete notebook instance on firebase
	 * @param notebookId
	 * @param userId
	 */
	async deleteNotebook(notebookId: string, userId: string): Promise<Response> {
		/**
		 * Check if a user is authorized to edit the current notebook
		 */
		if (!(await this.accessService.checkCreator(notebookId, userId))) {
			throw new HttpException('User is not authorized to delete notebook.', HttpStatus.UNAUTHORIZED);
		}

		/**
		 * Delete all notes in notebook
		 */
		await this.noteService.deleteAllNotes(notebookId);

		/**
		 * Remove user access from notebook
		 */
		const accessId = await this.accessService.getUserAccessId(notebookId, userId);
		await this.accessService.removeUserAccess({ notebookId, accessId }, userId);

		/**
		 * Delete notebook content on firebase
		 */
		return admin
			.firestore()
			.collection('userNotebooks')
			.doc(notebookId)
			.delete()
			.then(() => ({
				message: 'Successfully delete notebook!',
			}));
	}
}
