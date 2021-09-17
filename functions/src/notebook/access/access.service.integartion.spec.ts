import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { NotebookService } from '../notebook.service';
import { AccountService } from '../../account/account.service';
import { AccessService } from './access.service';
import { CreateNotebookDto } from '../dto/createNotebook.dto';
import { NoteService } from '../note/note.service';
import { ReviewService } from '../review/review.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../notification/notification.service';
import { AddAccessDto } from '../dto/addAccess.dto';
import { RemoveUserAccessDto } from '../dto/removeUserAccess.dto';

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

describe('Access Service Integration Tests', () => {
	let notebookService: NotebookService;
	let accessService: AccessService;
	const userId = 'sYTwoaCyHQO0cNAqJcxBnO70yne2';
	let notebookId = '';
	let accessId = '';

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
		accessService = module.get<AccessService>(AccessService);

		jest.setTimeout(30000);
	});

	describe('Check services are defined', () => {
		it('Access Service should be defined', () => {
			expect(accessService).toBeDefined();
		});

		it('Notebook Service should be defined', () => {
			expect(notebookService).toBeDefined();
		});
	});

	describe('Setup Notebook for testing', () => {
		it('Test successfully create a notebook', async () => {
			const createNotebookDto: CreateNotebookDto = {
				title: 'Test Access title',
				author: 'Test Access author',
				course: 'Test Access course',
				description: 'Test Access description',
				institution: 'Test Access institution',
				private: false,
				tags: ['Test tag 1', 'Test tag 2'],
			};
			const result = await notebookService.createNotebook(createNotebookDto, userId);
			notebookId = result.notebook.notebookId;

			expect(result.message).toStrictEqual('Successfully create new notebook');
		});
	});

	describe('Access Service Tests', () => {
		it('Get Access List, Should only contain the creator', async () => {
			const result = await accessService.getAccessList(notebookId);

			expect(result.length).toBe(1);
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].userId).toBe(userId);
			expect(result[0].displayName).toBe('UserTestNameAccount');
		});

		it('Add User to Access List', async () => {
			const addAccessDto: AddAccessDto = {
				displayName: 'Access DisplayName',
				userId,
				profileUrl: 'Access ProfileUrl',
				notebookId,
			};

			const result = await accessService.addAccess(addAccessDto, 'Access UserId');

			expect(result.message).toBe('Successfully added notebook to user account');
		});

		it('Throw Exception: Try to add user to access when not the creator', async () => {
			let error: HttpException;
			const addAccessDto: AddAccessDto = {
				displayName: 'Access DisplayName',
				userId: 'UnauthorizedUser',
				profileUrl: 'Access ProfileUrl',
				notebookId,
			};

			try {
				await accessService.addAccess(addAccessDto, 'Access UserId');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User is not authorized to add user access to notebook.');
		});

		it('Get Access List, Should only contain two users', async () => {
			const result = await accessService.getAccessList(notebookId);

			accessId = result[0].accessId;

			expect(result.length).toBe(2);
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].userId).toBe('Access UserId');
			expect(result[0].displayName).toBe('Access DisplayName');
		});

		it('Throw Exception: Try to remove user from access when not the creator', async () => {
			let error: HttpException;

			const removeUserAccessDto: RemoveUserAccessDto = {
				notebookId,
				accessId,
			};

			try {
				await accessService.removeUserAccess(removeUserAccessDto, 'UnauthorizedUser');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User is not authorized to remove user access to the specified notebook.');
		});

		it('Remove User From Access List', async () => {
			const removeUserAccessDto: RemoveUserAccessDto = {
				notebookId,
				accessId,
			};

			const result = await accessService.removeUserAccess(removeUserAccessDto, userId);

			expect(result.message).toBe("Successfully revoked user's access to the current notebook");
		});

		it('Throw Exception: Remove User From Access List With Invalid Access Id', async () => {
			let error: HttpException;

			const removeUserAccessDto: RemoveUserAccessDto = {
				notebookId,
				accessId: 'InvalidAccessId',
			};

			try {
				await accessService.removeUserAccess(removeUserAccessDto, 'UnauthorizedUser');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User is not authorized to remove user access to the specified notebook.');
		});
	});

	describe('Remove Setup for Notebook', () => {
		it('Delete Notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});
});
