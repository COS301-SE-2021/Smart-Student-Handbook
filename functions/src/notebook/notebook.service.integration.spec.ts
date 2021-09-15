import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { AccountService } from '../account/account.service';
import { NotebookController } from './notebook.controller';
import { UserService } from '../user/user.service';
import { CreateNotebookDto } from './dto/createNotebook.dto';
import { NoteService } from './note/note.service';
import { AccessService } from './access/access.service';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../auth/auth.service';
import { ReviewService } from './review/review.service';
import { UpdateNotebookDto } from './dto/updateNotebook.dto';

const serviceAccount = require('../../service_account.json');

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

describe('Notebook Service Integration Tests', () => {
	let notebookService: NotebookService;
	let accountService: AccountService;
	let notebookId = '';
	let userId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
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
		//
		notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);

		jest.setTimeout(30000);
	});

	describe('Check that services are defined', () => {
		it('Notebook Service should be defined', () => {
			expect(notebookService).toBeDefined();
		});

		it('Account Service should be defined', () => {
			expect(accountService).toBeDefined();
		});
	});

	describe('Login user to be used', () => {
		it('Should login a user successfully', async () => {
			const user = {
				email: 'TestUserAccount@gmail.com',
				password: 'TestPassword!0',
			};

			const result = await accountService.loginUser(user);

			userId = result.user.uid;

			expect(result.message).toBe('User is successfully logged in!');
		});
	});

	describe('Notebooks tests', () => {
		it('Get notebooks for user with no notebooks', async () => {
			const result = await notebookService.getUserNotebooks(userId);

			expect(result).toStrictEqual([]);
		});

		it('Test successfully create a notebook', async () => {
			const createNotebookDto: CreateNotebookDto = {
				title: 'Test title',
				author: 'Test author',
				course: 'Test course',
				description: 'Test description',
				institution: 'Test institution',
				private: false,
				tags: ['Test tag 1', 'Test tag 2'],
			};
			const result = await notebookService.createNotebook(createNotebookDto, userId);
			notebookId = result.notebook.notebookId;

			expect(result.message).toStrictEqual('Successfully create new notebook');
			expect(result.notebook.access.length).toBe(1);
			expect(result.notebook.access[0].displayName).toBe('UserTestNameAccount');
			expect(result.notebook.access[0].userId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.notebook.author).toBe('Test author');
			expect(result.notebook.course).toBe('Test course');
			expect(result.notebook.creatorId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.notebook.description).toBe('Test description');
			expect(result.notebook.institution).toBe('Test institution');
			expect(result.notebook.notes.length).toBe(1);
			expect(result.notebook.notes[0].description).toBe('My first note');
			expect(result.notebook.notes[0].name).toBe('Introduction');
			expect(result.notebook.notes[0].notebookId).toBe(notebookId);
			expect(result.notebook.notes[0].tags).toStrictEqual([]);
			expect(result.notebook.private).toBe(false);
			expect(result.notebook.title).toBe('Test title');
			expect(result.notebook.tags.length).toBe(2);
			expect(result.notebook.tags[0]).toBe('Test tag 1');
			expect(result.notebook.tags[1]).toBe('Test tag 2');
		});

		it('Get notebooks for user with 1 notebook', async () => {
			const result = await notebookService.getUserNotebooks(userId);

			expect(result.length).toBe(1);
			expect(result[0].access.length).toBe(1);
			expect(result[0].access[0].displayName).toBe('UserTestNameAccount');
			expect(result[0].access[0].notebookId).toBe(notebookId);
			expect(result[0].access[0].userId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result[0].author).toBe('Test author');
			expect(result[0].course).toBe('Test course');
			expect(result[0].creatorId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result[0].description).toBe('Test description');
			expect(result[0].institution).toBe('Test institution');
			expect(result[0].notes.length).toBe(1);
			expect(result[0].notes[0].description).toBe('My first note');
			expect(result[0].notes[0].name).toBe('Introduction');
			expect(result[0].notes[0].notebookId).toBe(notebookId);
			expect(result[0].notes[0].tags).toStrictEqual([]);
			expect(result[0].private).toBe(false);
			expect(result[0].title).toBe('Test title');
			expect(result[0].tags.length).toBe(2);
			expect(result[0].tags[0]).toBe('Test tag 1');
			expect(result[0].tags[1]).toBe('Test tag 2');
		});

		it('Get notebook by Id', async () => {
			const result = await notebookService.getNotebook(notebookId);

			expect(result.access.length).toBe(1);
			expect(result.access[0].displayName).toBe('UserTestNameAccount');
			expect(result.access[0].userId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.author).toBe('Test author');
			expect(result.course).toBe('Test course');
			expect(result.creatorId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.description).toBe('Test description');
			expect(result.institution).toBe('Test institution');
			expect(result.title).toBe('Test title');
			expect(result.tags.length).toBe(2);
			expect(result.tags[0]).toBe('Test tag 1');
			expect(result.tags[1]).toBe('Test tag 2');
		});

		it('Updated notebook content', async () => {
			const updateNotebookDto: UpdateNotebookDto = {
				title: 'Updated title',
				author: 'Updated author',
				course: 'Updated course',
				description: 'Updated description',
				institution: 'Updated institution',
				private: false,
				tags: ['Updated tag 1', 'Updated tag 2'],
				notebookId,
			};
			const result = await notebookService.updateNotebook(updateNotebookDto, userId);

			expect(result.message).toStrictEqual('Updated notebook successful!');
		});

		it('Check if user notebook updated on the database', async () => {
			const result = await notebookService.getNotebook(notebookId);

			expect(result.access.length).toBe(1);
			expect(result.access[0].displayName).toBe('UserTestNameAccount');
			expect(result.access[0].userId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.author).toBe('Updated author');
			expect(result.course).toBe('Updated course');
			expect(result.creatorId).toBe('sYTwoaCyHQO0cNAqJcxBnO70yne2');
			expect(result.description).toBe('Updated description');
			expect(result.institution).toBe('Updated institution');
			expect(result.notes.length).toBe(1);
			expect(result.notes[0].description).toBe('My first note');
			expect(result.notes[0].name).toBe('Introduction');
			expect(result.notes[0].notebookId).toBe(notebookId);
			expect(result.notes[0].tags).toStrictEqual([]);
			expect(result.private).toBe(false);
			expect(result.title).toBe('Updated title');
			expect(result.tags.length).toBe(2);
			expect(result.tags[0]).toBe('Updated tag 1');
			expect(result.tags[1]).toBe('Updated tag 2');
		});

		it('Throw Exception: Try to update other users notebook', async () => {
			let error: HttpException;
			const updateNotebookDto: UpdateNotebookDto = {
				title: 'Invalid title',
				author: 'Invalid author',
				course: 'Invalid course',
				description: 'Invalid description',
				institution: 'Invalid institution',
				private: false,
				tags: ['Invalid tag 1', 'Invalid tag 2'],
				notebookId,
			};

			try {
				await notebookService.updateNotebook(updateNotebookDto, 'Unauthorized User');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User is not authorized to update this notebook.');
		});

		it('Throw Exception: Try delete other users notebook', async () => {
			let error: HttpException;

			try {
				await notebookService.deleteNotebook(notebookId, 'Unauthorized User');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User is not authorized to delete notebook.');
		});

		it('Throw Exception: Try to find notebook that does note exist', async () => {
			let error: HttpException;

			try {
				await notebookService.getNotebook('DoesNotExistNotebookId');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('Could net retrieve notebook, it could be that the notebook does not exist');
		});

		it('Delete Notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});
});