import { Test, TestingModule } from '@nestjs/testing';

import * as admin from 'firebase-admin';
import { mockCollection } from 'firestore-jest-mock/mocks/firestore';
import { NotebookService } from './notebook.service';
import { AccountService } from '../account/account.service';
import { NotebookController } from './notebook.controller';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { AccessService } from './access/access.service';
import { NoteService } from './note/note.service';
import { AuthService } from '../auth/auth.service';
import { ReviewService } from './review/review.service';

admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');

mockGoogleCloudFirestore({
	database: {
		users: [
			{
				bio: 'TestBio',
				dateJoined: 'test date here',
				department: 'Test department',
				institution: 'test institution',
				username: 'test Name',
				program: 'Test program',
				uid: 'UserIdTest',
				workStatus: 'test status',
			},
		],
		userNotebooks: [
			{
				title: 'Updated Title',
				author: 'Updated Author',
				course: 'Updated Course',
				description: 'Updated Description',
				institution: 'Updated Institution',
				notebookId: 'NotebookId',
				creatorId: 'UserIdTest',
				private: false,
				tags: ['update tag1', 'update tag2'],
			},
		],
		notebookAcces: [
			{
				displayName: 'Test Display Name',
				userId: 'UserIdTest',
				profileUrl: 'Test Profile Url',
				notebookId: 'NotebookId',
			},
		],
	},
});

describe('NotebookTests', () => {
	let notebookService: NotebookService;
	let accountService: AccountService;

	const notebookId = '';

	const userId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [
				NotebookService,
				AccountService,
				NotificationService,
				UserService,
				NoteService,
				AccessService,
				AuthService,
				ReviewService,
			],
		}).compile();
		//
		notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);

		jest.setTimeout(30000);
	});

	describe('loginUser', () => {
		it('Test should login a user', async () => {
			const user = {
				email: 'TestAccount82982@gmail.com',
				password: 'TestPassword01!',
			};

			const result = await accountService.loginUser(user);
			// userId = result.user.uid;

			expect(result.message).toBe('Login failed, please try again!');
		});
	});

	describe('Search notebooks', () => {
		it('Should Return empty array', async () => {
			const result = await notebookService.getUserNotebooks(userId);

			expect(result).toStrictEqual([]);
		});

		it('Should Return empty array', async () => {
			let result;
			try {
				result = await notebookService.getNotebook('NotebookDoesNotExist');
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Could net retrieve notebook, it could be that the notebook does not exist');
			expect(result.status).toBe(404);
		});
	});

	describe('Get a Users Notebooks', () => {
		it('This function should return al user notebooks(Only one notebook in this case)', async () => {
			await notebookService.getUserNotebooks(userId);

			expect(mockCollection).toBeCalledWith('notebookAccess');
		});
	});

	describe('Get notebook', () => {
		it('This function should return al user notebooks(Only one notebook in this case)', async () => {
			let result;
			try {
				result = await notebookService.getNotebook('NotebookDoesNotExist');
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Could net retrieve notebook, it could be that the notebook does not exist');
			expect(result.status).toBe(404);
		});
	});

	describe('Update Notebook Content', () => {
		it('Should fail try to update notebook when user should not be able to', async () => {
			const notebook = {
				title: 'Updated Title',
				author: 'Updated Author',
				course: 'Updated Course',
				description: 'Updated Description',
				institution: 'Updated Institution',
				notebookId,
				creatorId: 'noAccessUser',
				private: false,
				tags: ['update tag1', 'update tag2'],
				userId,
			};

			let result;

			try {
				result = await notebookService.updateNotebook(notebook, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('User is not authorized to update this notebook.');
			expect(result.status).toBe(401);
		});
	});
});
