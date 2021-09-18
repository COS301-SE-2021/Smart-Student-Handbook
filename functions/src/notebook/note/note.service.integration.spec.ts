import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { NotebookService } from '../notebook.service';
import { AccountService } from '../../account/account.service';
import { AccessService } from '../access/access.service';
import { CreateNotebookDto } from '../dto/createNotebook.dto';
import { NoteService } from './note.service';
import { ReviewService } from '../review/review.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../notification/notification.service';
import { CreateNoteDto } from '../dto/createNote.dto';
import { UpdateNoteDto } from '../dto/updateNote.dto';

const serviceAccount = require('../../../service_account.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
});

const firebaseConfig = {
	apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
	authDomain: 'smartstudentnotebook.firebaseapp.com',
	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'smartstudentnotebook',
	storageBucket: 'smartstudentnotebook.appspot.com',
	messagingSenderId: '254968215542',
	appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
	measurementId: 'G-YDRCWDT5QJ',
};
firebase.initializeApp(firebaseConfig);

describe('Note Service Integration Tests', () => {
	let notebookService: NotebookService;
	let noteService: NoteService;
	const userId = 'OLazjOwi0RTnQbBeV0Z2ylHCgoy2';
	let notebookId = '';
	let noteId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NotebookService,
				AccountService,
				NoteService,
				ReviewService,
				AuthService,
				UserService,
				AccessService,
				NotificationService,
			],
		}).compile();

		notebookService = module.get<NotebookService>(NotebookService);
		noteService = module.get<NoteService>(NoteService);

		jest.setTimeout(30000);
	});

	describe('Check services are defined', () => {
		it('Access Service should be defined', () => {
			expect(notebookService).toBeDefined();
		});

		it('Note Service should be defined', () => {
			expect(noteService).toBeDefined();
		});
	});

	describe('Setup Notebook for testing', () => {
		it('Test successfully create a notebook', async () => {
			const createNotebookDto: CreateNotebookDto = {
				title: 'Test Note title',
				author: 'Test Note author',
				course: 'Test Note course',
				description: 'Test Note description',
				institution: 'Test Note institution',
				private: false,
				tags: ['Test Note tag 1', 'Test Note tag 2'],
			};
			const result = await notebookService.createNotebook(createNotebookDto, userId);
			notebookId = result.notebook.notebookId;

			expect(result.message).toStrictEqual('Successfully create new notebook');
		});
	});

	describe('Note Service Tests ', () => {
		it('Get notes for the created notebook', async () => {
			const result = await noteService.getNotes(notebookId);

			expect(result.length).toBe(1);
			expect(result[0].tags).toStrictEqual([]);
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].name).toBe('Introduction for Test Note title');
			expect(result[0].description).toBe('My first note for Test Note title');
		});

		it('Get notes for notebooks that does not exist, should return empty list', async () => {
			const result = await noteService.getNotes('Not A NoteId');

			expect(result.length).toBe(0);
			expect(result).toStrictEqual([]);
		});

		it('Throw Exception. Try to create a note for a other users notebook', async () => {
			let error: HttpException;
			const createNoteDto: CreateNoteDto = {
				name: 'Invalid Note Name',
				notebookId,
				description: 'Invalid Note Description',
				tags: ['Invalid tag 1', 'Invalid tag 2'],
			};
			try {
				await noteService.createNote(createNoteDto, 'UnauthorizedUser');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User does not have access to create a new note in this notebook.');
		});

		it('Create a note for your notebook', async () => {
			const createNoteDto: CreateNoteDto = {
				name: 'Test Note Name',
				notebookId,
				description: 'Test Note Description',
				tags: ['Test tag 1', 'Test tag 2'],
			};
			const result = await noteService.createNote(createNoteDto, userId);

			noteId = result.noteId;

			expect(result.message).toBe('Successfully created note');
		});

		it('Get notes after you create a new note', async () => {
			const result = await noteService.getNotes(notebookId);

			expect(result.length).toBe(2);
			expect(result[0].tags.length).toBe(2);
			expect(result[0].tags[0]).toBe('Test tag 1');
			expect(result[0].tags[1]).toBe('Test tag 2');
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].name).toBe('Test Note Name');
			expect(result[0].description).toBe('Test Note Description');
		});

		it('Update note', async () => {
			const updateNoteDto: UpdateNoteDto = {
				name: 'Update Note Name',
				notebookId,
				description: 'Update Note Description',
				tags: ['Update tag 1', 'Update tag 2'],
				noteId,
			};
			const result = await noteService.updateNote(updateNoteDto, userId);

			expect(result.message).toBe('Successfully updated note');
		});

		it('Throw Exception: Try to update other users note', async () => {
			let error: HttpException;
			const updateNoteDto: UpdateNoteDto = {
				name: 'Invalid Note Name',
				notebookId,
				description: 'Invalid Note Description',
				tags: ['Invalid tag 1', 'Invalid tag 2'],
				noteId,
			};
			try {
				await noteService.updateNote(updateNoteDto, 'UnauthorizedUser');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User does not have access to create a new note in this notebook.');
		});

		it('Check if note updated in database', async () => {
			const result = await noteService.getNotes(notebookId);

			expect(result.length).toBe(2);
			expect(result[0].tags.length).toBe(2);
			expect(result[0].tags[0]).toBe('Update tag 1');
			expect(result[0].tags[1]).toBe('Update tag 2');
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].name).toBe('Update Note Name');
			expect(result[0].description).toBe('Update Note Description');
		});

		it('Delete note from notebook', async () => {
			const result = await noteService.deleteNote(notebookId, noteId);

			expect(result.message).toBe('Successfully delete note for notebook');
		});

		it('Check if note was delete in database', async () => {
			const result = await noteService.getNotes(notebookId);

			expect(result.length).toBe(1);
			expect(result[0].name).toBe('Introduction for Test Note title');
		});
	});

	describe('Remove Setup for Notebook', () => {
		it('Delete Notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});
});
