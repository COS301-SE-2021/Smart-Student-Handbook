import { Test, TestingModule } from '@nestjs/testing';
import { mockFirebase } from 'firestore-jest-mock';
// import { mockCollection, mockDoc } from 'firestore-jest-mock/mocks/firestore';
// import firebase from 'firebase';
// import * as admin from 'firebase-admin';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { NotebookService } from './notebook.service';
import { AccountService } from '../account/account.service';
import { NotebookController } from './notebook.controller';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

mockFirebase({
	database: {
		userContent: [
			{
				id: 'LouwId',
				Notebooks: [{ id: 'notebook1', notebookId: 'notebook1' }],
			},
		],
		userNotebooks: [
			{
				id: 'docId1',
				access: [],
				course: 'COS301',
				author: 'Louw',
				creatorId: 'LouwId',
				descriptions: 'Test notebook',
				notebookId: 'notebook1',
				notes: [
					{
						name: 'Introduction',
						noteId: '53a7d82a-4ae1-4851-99d6-984fa32fe6e0',
						description: 'My first note',
						createDate: 1629059393668,
					},
				],
				private: false,
				tags: ['tag1', 'tag2'],
				title: 'Louw Notebook',
			},
		],
	},
});

// test('testing stuff', () => {
// 	const mock = jest.fn();
// 	mock.mockReturnValueOnce('test');
//
// 	// console.log(service.mock.getUserId());
// });

// describe('findAll', () => {
// 	it('should return an array of cats', async () => {
// 		// eslint-disable-next-line global-require,import/no-extraneous-dependencies
// 		const { Firestore } = require('@google-cloud/firestore');
// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 		const firestore = new Firestore();
//
// 		const result = 'LouwId1';
// 		jest.spyOn(service, 'getUserId').mockImplementation(async () => result);
//
// 		await service.getNotebook('docId1');
//
// 		expect(await service.getUserId()).toBe(result);
// 		expect(mockDoc).toHaveBeenCalledWith('docId1');
// 	});
// });

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

describe('NotebookIntegrationTests', () => {
	let notebookService: NotebookService;
	let accountService: AccountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [NotebookService, AccountService, NotificationService, UserService],
		}).compile();

		notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);
	});

	describe('createUser', () => {
		it('Test should register a user successfully', async () => {
			const user = {
				email: 'louwTest1@gmail.com',
				password: 'TestPassword01!',
				passwordConfirm: 'TestPassword01!',
				username: 'louwTest1',
				isLocalHost: true,
			};

			const result = await accountService.registerUser(user);

			expect(result.message).toBe('User is successfully registered!');
		});
	});

	describe('loginUser', () => {
		it('Test should login a user', async () => {
			const user = {
				email: 'louwTest@gmail.com',
				password: 'TestPassword01!',
			};

			const result = await accountService.loginUser(user);
			console.log(result);

			expect(result.message).toBe('User is successfully registered!');
		});
	});

	describe('findAll', () => {
		it('should return an array of cats', async () => {
			const notebook = {
				title: 'Notebook Title',
				author: 'Notebook Author',
				course: 'Course',
				description: 'Description',
				institution: 'Institution',
				private: true,
				tags: ['tag1', 'tag2'],
			};

			const result = await notebookService.createNotebook(notebook);
			console.log(result);

			expect(result).toThrowError('Error: Unable to complete request. User might not be signed in.');
		});
	});
});
