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

	/* describe('Create a New Note', () => {
		it('Test should create a new note on the specified notebook', async () => {
			const note = {
				name: 'Test Note Title',
				notebookId,
				description: 'Test Note Description',
				userId,
			};

			const result = await notebookService.createNote(note, userId);
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

	describe('Update Note', () => {
		it('Test should update a note on a notebook', async () => {
			const note = {
				name: 'Update Note Title',
				notebookId,
				noteId,
				description: 'Update Note Description',
				userId,
			};

			const result = await notebookService.updateNote(note, userId);

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

	describe('Try to delete notes', () => {
		it('Test should delete note from notebook', async () => {
			const note = {
				notebookId,
				noteId,
				userId,
			};

			const result = await notebookService.deleteNote(note);

			expect(result.message).toBe('Successfully delete note!');
		});
	});

	describe('Get notes after deleting a note', () => {
		it('Test should return 1 note since the other note was deleted in the previous test', async () => {
			const result = await notebookService.getNotes(notebookId);

			expect(result.length).toBe(1);
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
			const result = await notebookService.addNotebookReview(review, userId);

			expect(result.message).toBe('Successfully added a review!');
		});

		it('Get Notebook Reviews', async () => {
			const result = await notebookService.getNotebookReviews(notebookId);

			expect(result.length).toBe(1);
			expect(result[0].message).toBe('Test review message');
			expect(result[0].rating).toBe(8);
			expect(result[0].displayName).toBe(`TestAccount${randomNumber}`);
			expect(result[0].profileUrl).toBe('Test Profile Url');
		});

		it('Try to Access Invalid Notebook', async () => {
			let result;
			try {
				result = await notebookService.getNotebookReviews('ImpossibleIdNumber');
			} catch (e) {
				result = e;
			}

			expect(result).toStrictEqual([]);
		});

		it('Add Reviews to a notebook', async () => {
			let result;
			try {
				result = await notebookService.deleteNotebookReview(notebookId, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('Deleted review successfully!');
		});
	});

	/*	describe('Check Creator', () => {
		it('Creator Check True', async () => {
			const result = await notebookService.checkCreator(notebookId, userId);

			expect(result).toBe(true);
		});

		it('Creator Check False', async () => {
			const result = await notebookService.checkCreator(notebookId, 'noteAdminUser');

			expect(result).toBe(false);
		});
	});

	describe('Delete Notebook', () => {
		it('Test should delete all instances of the specified notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});

	describe('Try to sign out', () => {
		it('Sign out', async () => {
			const result = await accountService.signOut();

			expect(result.message).toBe('Successfully signed out.');
		});
	});

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
	}); */
});
