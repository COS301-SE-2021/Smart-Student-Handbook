import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotebookService } from './notebook.service';
import { AccountService } from '../account/account.service';
import { NotebookController } from './notebook.controller';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'http://localhost:4000/',
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

describe('NotebookIntegrationTests', () => {
	let notebookService: NotebookService;
	let accountService: AccountService;
	const randomNumber: number = Math.floor(Math.random() * 100000);
	let notebookId = '';
	let noteId = '';
	let userId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [NotebookService, AccountService, NotificationService, UserService],
		}).compile();
		//
		notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);

		jest.setTimeout(30000);
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
			userId = result.user.uid;

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

	describe('Create Notebook', () => {
		it('This function should create a new notebook and return the content of the created notebook', async () => {
			const notebook = {
				title: 'Test Title',
				author: 'Test Author',
				course: 'Test Course',
				description: 'Test Description',
				institution: 'Test Institution',
				private: true,
				tags: ['tag1', 'tag2'],
				userId,
			};

			const result = await notebookService.createNotebook(notebook);

			notebookId = result.notebook.notebookId;

			expect(result.message).toBe('Successfully added notebook to user account');
			expect(result.notebook.title).toBe('Test Title');
			expect(result.notebook.author).toBe('Test Author');
			expect(result.notebook.course).toBe('Test Course');
			expect(result.notebook.description).toBe('Test Description');
			expect(result.notebook.institution).toBe('Test Institution');
			expect(result.notebook.private).toBe(true);
			expect(result.notebook.tags).toStrictEqual(['tag1', 'tag2']);
			expect(result.notebook.access).toStrictEqual([]);
		});
	});

	describe('Get a Users Notebooks', () => {
		it('This function should return al user notebooks(Only one notebook in this case)', async () => {
			const result = await notebookService.getUserNotebooks(userId);

			expect(result[0].title).toBe('Test Title');
			expect(result[0].author).toBe('Test Author');
			expect(result[0].course).toBe('Test Course');
			expect(result[0].description).toBe('Test Description');
			expect(result[0].institution).toBe('Test Institution');
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].private).toBe(true);
			expect(result[0].tags).toStrictEqual(['tag1', 'tag2']);
			expect(result[0].access).toStrictEqual([]);
		});
	});

	describe('Get notebook', () => {
		it('This function should return al user notebooks(Only one notebook in this case)', async () => {
			const result = await notebookService.getNotebook(notebookId);

			expect(result.title).toBe('Test Title');
			expect(result.author).toBe('Test Author');
			expect(result.course).toBe('Test Course');
			expect(result.description).toBe('Test Description');
			expect(result.institution).toBe('Test Institution');
			expect(result.notebookId).toBe(notebookId);
			expect(result.private).toBe(true);
			expect(result.tags).toStrictEqual(['tag1', 'tag2']);
			expect(result.access).toStrictEqual([]);
		});
	});

	describe('Update Notebook Content', () => {
		it('Test should update notebook content to new content', async () => {
			const notebook = {
				title: 'Updated Title',
				author: 'Updated Author',
				course: 'Updated Course',
				description: 'Updated Description',
				institution: 'Updated Institution',
				notebookId,
				private: false,
				tags: ['update tag1', 'update tag2'],
				userId,
			};

			const result = await notebookService.updateNotebook(notebook);

			const updatedNotebook = await notebookService.getNotebook(notebookId);

			expect(result.message).toBe('Updated notebook successful!');
			expect(updatedNotebook.title).toBe('Updated Title');
			expect(updatedNotebook.author).toBe('Updated Author');
			expect(updatedNotebook.course).toBe('Updated Course');
			expect(updatedNotebook.description).toBe('Updated Description');
			expect(updatedNotebook.institution).toBe('Updated Institution');
			expect(updatedNotebook.private).toBe(false);
			expect(updatedNotebook.tags).toStrictEqual(['update tag1', 'update tag2']);
		});
	});

	describe('Create a new Note', () => {
		it('Test should create a new note on the specified notebook', async () => {
			const note = {
				name: 'Test Note Title',
				notebookId,
				description: 'Test Note Description',
				userId,
			};

			const result = await notebookService.createNote(note);
			noteId = result.noteId;

			expect(result.message).toBe('Creating a note was successful!');
		});
	});

	describe('Get Notebook Notes', () => {
		it('Test should return a list of notes that are contained in this notebook(thus 2 notes)', async () => {
			const result = await notebookService.getNotes(notebookId);

			expect(result.length).toBe(2);
			expect(result[1].name).toBe('Test Note Title');
			expect(result[1].description).toBe('Test Note Description');
		});
	});

	describe('Update note', () => {
		it('Test should update a note on a notebook', async () => {
			const note = {
				name: 'Update Note Title',
				notebookId,
				noteId,
				description: 'Update Note Description',
				userId,
			};

			const result = await notebookService.updateNote(note);

			expect(result.message).toBe('Update a note successfully!');
		});
	});

	describe('Get updated Notebook Notes', () => {
		it('Test should return a list of notes that are contained in this notebook(thus 2 notes)', async () => {
			const result = await notebookService.getNotes(notebookId);

			expect(result.length).toBe(2);
			expect(result[1].name).toBe('Update Note Title');
			expect(result[1].description).toBe('Update Note Description');
		});
	});

	// describe('Try to delete notes', () => {
	// 	it('Test should delete note from notebook', async () => {
	// 		const note = {
	// 			notebookId,
	// 			noteId,
	// 			userId,
	// 		};
	//
	// 		const result = await notebookService.deleteNote(note);
	//
	// 		expect(result.message).toBe('Successfully delete note!');
	// 	});
	// });

	describe('Get notes after deleting a note', () => {
		it('Test should return 1 note since the other note was deleted in the previous test', async () => {
			const result = await notebookService.getNotes(notebookId);

			expect(result.length).toBe(2);
		});
	});

	describe('Notebook Reviews', () => {
		it('Add Reviews to a notebook', async () => {
			const review = {
				notebookId,
				message: 'Test review message',
				rating: 8,
				displayName: `TestAccount${randomNumber}`,
				userId,
				profileUrl: 'Test Profile Url',
			};
			const result = await notebookService.addNotebookReview(review);

			expect(result.message).toBe('Successfully added a review!');
		});

		// it('Should throw exception when trying to add a review to and invalid notebookId', async () => {
		// 	let result;
		// 	const review = {
		// 		notebookId: 'Invalid notebookId',
		// 		message: 'Test review message',
		// 		rating: 8,
		// 		displayName: `TestAccount${randomNumber}`,
		// 		userId,
		// 		profileUrl: 'Test Profile Url',
		// 	};
		//
		// 	try {
		// 		await notebookService.addNotebookReview(review);
		// 	} catch (e) {
		// 		result = e;
		// 	}
		//
		// 	expect(result.message).toBe('Unable to complete request. User might not be signed in.');
		// 	expect(result.status).toBe(400);
		// });
	});

	describe('Delete Notebook', () => {
		it('Test should delete all instances of the specified notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});

	describe('Delete User', () => {
		it('Test should delete a user and all files relating to that user', async () => {
			const result = await accountService.deleteUser();

			expect(result.message).toBe('Successfully deleted user!');
		});
	});

	describe('Try to sign out', () => {
		it('Sign out', async () => {
			const result = await accountService.signOut();

			expect(result.message).toBe('Successfully signed out.');
		});
	});

	// describe('Preforming actions when a user is not signed in', () => {
	// 	it('User not signed in test', async () => {
	// 		let result;
	// 		try {
	// 			await notebookService.getUserId();
	// 		} catch (e) {
	// 			result = e;
	// 		}
	//
	// 		expect(result.message).toBe('Unable to complete request. User might not be signed in.');
	// 		expect(result.status).toBe(400);
	// 	});
	// });

	describe('Try to get a notebook  that does not exist', () => {
		it('Should throw file not found error', async () => {
			let result;
			try {
				await notebookService.getNotebook('impossible id');
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Could net retrieve notebook, it could be that the notebook does not exist');
			expect(result.status).toBe(404);
		});
	});

	describe('Try to delete notes', () => {
		it('Should throw error when deleting a note that does not exist', async () => {
			let result;
			const note = {
				notebookId: 'impossible note id',
				noteId,
				userId,
			};

			try {
				await notebookService.deleteNote(note);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Documents does not seem to exist.');
			expect(result.status).toBe(404);
		});

		it('Should throw error when deleting a note from a notebook that does not exist', async () => {
			let result;
			const note = {
				notebookId,
				noteId: 'impossible note id',
				userId,
			};

			try {
				await notebookService.deleteNote(note);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Documents does not seem to exist.');
			expect(result.status).toBe(404);
		});
	});
});
