import { Test, TestingModule } from '@nestjs/testing';
import { mockFirebase } from 'firestore-jest-mock';
// import { mockCollection, mockDoc } from 'firestore-jest-mock/mocks/firestore';
// import firebase from 'firebase';
// import * as admin from 'firebase-admin';
// import * as admin from 'firebase-admin';
import firebase from '@firebase/rules-unit-testing';
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

firebase.initializeTestApp({
	projectId: 'smartstudentnotebook',
	auth: { uid: 'louw707', email: 'louw707@gmail.com' },
});

firebase.initializeAdminApp({ projectId: 'smartstudentnotebook' });

// const firebaseConfig = {
// 	apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
// 	authDomain: 'smartstudentnotebook.firebaseapp.com',
// 	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
// 	projectId: 'smartstudentnotebook',
// 	storageBucket: 'smartstudentnotebook.appspot.com',
// 	messagingSenderId: '254968215542',
// 	appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
// 	measurementId: 'G-YDRCWDT5QJ',
// };

describe('NotebookIntegrationTests', () => {
	// let notebookService: NotebookService;
	let accountService: AccountService;
	const randomNumber: number = Math.floor(Math.random() * 100000);

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [NotebookService, AccountService, NotificationService, UserService],
		}).compile();
		//
		// notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);
	});

	describe('createUser', () => {
		it('Test should register a user successfully', async () => {
			const user = {
				email: `TestAccount${randomNumber}@gmail.com`,
				password: 'TestPassword01!',
				passwordConfirm: 'TestPassword01!',
				username: `TestAccount${randomNumber}`,
				isLocalHost: true,
			};

			const result = await accountService.registerUser(user);

			expect(result.message).toBe('User is successfully registered!');
		});
	});

	describe('loginUser', () => {
		it('Test should login a user', async () => {
			const user = {
				email: `TestAccount${randomNumber}@gmail.com`,
				password: 'TestPassword01!',
			};

			const result = await accountService.loginUser(user);

			expect(result.message).toBe('User is successfully logged in!');
		});
	});

	// describe('Create Notebook', () => {
	// 	it('This function should create a new notebook and return the content of the created notebook', async () => {
	// 		const notebook = {
	// 			title: 'Test Title',
	// 			author: 'Test Author',
	// 			course: 'Test Course',
	// 			description: 'Test Description',
	// 			institution: 'Test Institution',
	// 			private: true,
	// 			tags: ['tag1', 'tag2'],
	// 		};
	//
	// 		const result = await notebookService.createNotebook(notebook);
	//
	// 		expect(result.message).toBe('Successfully added notebook to user account');
	// 		expect(result.notebook.title).toBe('Test Title');
	// 		expect(result.notebook.author).toBe('Test Author');
	// 		expect(result.notebook.course).toBe('Test Course');
	// 		expect(result.notebook.description).toBe('Test Description');
	// 		expect(result.notebook.institution).toBe('Test Institution');
	// 		expect(result.notebook.private).toBe(true);
	// 		expect(result.notebook.tags).toStrictEqual(['tag1', 'tag2']);
	// 		expect(result.notebook.access).toStrictEqual([]);
	// 	});
	// });
	//
	// describe('Get a Users Notebooks', () => {
	// 	it('This function should return al user notebooks(Only one notebook in this case)', async () => {
	// 		const result = await notebookService.getUserNotebooks();
	//
	// 		expect(result[0].title).toBe('Test Title');
	// 		expect(result[0].author).toBe('Test Author');
	// 		expect(result[0].course).toBe('Test Course');
	// 		expect(result[0].description).toBe('Test Description');
	// 		expect(result[0].institution).toBe('Test Institution');
	// 		expect(result[0].private).toBe(true);
	// 		expect(result[0].tags).toStrictEqual(['tag1', 'tag2']);
	// 		expect(result[0].access).toStrictEqual([]);
	// 	});
	// });
});
