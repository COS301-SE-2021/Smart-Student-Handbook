import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { NotebookService } from '../notebook.service';
import { AccountService } from '../../account/account.service';
import { AccessService } from '../access/access.service';
import { CreateNotebookDto } from '../dto/createNotebook.dto';
import { NoteService } from '../note/note.service';
import { ReviewService } from './review.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../notification/notification.service';
import { AddNotebookReviewDto } from '../dto/addNotebookReview.dto';
import { AddNoteReviewDto } from '../dto/AddNoteReview.dto';

const serviceAccount = require('../../../service_account.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://smartstudenthandboook-dev-default-rtdb.firebaseio.com',
});

const firebaseConfig = {
	apiKey: 'AIzaSyCsXWdPjNUqLsDCp05RpY3-J8Mtb9P11JM',
	authDomain: 'smartstudenthandboook-dev.firebaseapp.com',
	databaseURL: 'https://smartstudenthandboook-dev-default-rtdb.firebaseio.com',
	projectId: 'smartstudenthandboook-dev',
	storageBucket: 'smartstudenthandboook-dev.appspot.com',
	messagingSenderId: '953003868912',
	appId: '1:953003868912:web:5c91964eb8289263253835',
	measurementId: 'G-V286FE7KN8',
};
firebase.initializeApp(firebaseConfig);

describe('Review Service Integration Tests', () => {
	let notebookService: NotebookService;
	let reviewService: ReviewService;
	const userId = 'BvzwT1hKTETNLvXeCMgxinOm0GH3';
	let notebookId = '';
	let noteId = '';
	let reviewId = '';

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
		reviewService = module.get<ReviewService>(ReviewService);

		jest.setTimeout(30000);
	});

	describe('Check services are defined', () => {
		it('Access Service should be defined', () => {
			expect(notebookService).toBeDefined();
		});

		it('Review Service should be defined', () => {
			expect(reviewService).toBeDefined();
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
			noteId = result.notebook.notes[0].noteId;

			expect(result.message).toStrictEqual('Successfully create new notebook');
		});
	});

	describe('Notebook Review Service Tests', () => {
		it('Get reviews for notebook with no reviews', async () => {
			const result = await reviewService.getNotebookReviews(notebookId);

			expect(result).toStrictEqual([]);
		});

		it('Add notebook review', async () => {
			const addNotebookReviewDto: AddNotebookReviewDto = {
				notebookId,
				message: 'Test Notebook message',
				rating: 5,
				displayName: 'Test Notebook displayName',
				profileUrl: 'Test Notebook profileUrl',
			};
			const result = await reviewService.addNotebookReview(addNotebookReviewDto, userId);

			expect(result.message).toStrictEqual('Successfully added a review!');
		});

		it('Get reviews for notebook with one reviews', async () => {
			const result = await reviewService.getNotebookReviews(notebookId);

			reviewId = result[0].reviewId;

			expect(result.length).toBe(1);
			expect(result[0].displayName).toBe('Test Notebook displayName');
			expect(result[0].message).toBe('Test Notebook message');
			expect(result[0].rating).toBe(5);
			expect(result[0].profileUrl).toBe('Test Notebook profileUrl');
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].userId).toBe(userId);
		});

		it('Try to create duplicate review, should override old review', async () => {
			const addNotebookReviewDto: AddNotebookReviewDto = {
				notebookId,
				message: 'Duplicate Notebook message',
				rating: 1,
				displayName: 'Duplicate Notebook displayName',
				profileUrl: 'Duplicate Notebook profileUrl',
			};
			const result = await reviewService.addNotebookReview(addNotebookReviewDto, userId);

			expect(result.message).toStrictEqual('Successfully added a review!');
		});

		it('Check if review update and if there are no duplicates', async () => {
			const result = await reviewService.getNotebookReviews(notebookId);

			expect(result.length).toBe(1);
			expect(result[0].displayName).toBe('Duplicate Notebook displayName');
			expect(result[0].message).toBe('Duplicate Notebook message');
			expect(result[0].rating).toBe(1);
			expect(result[0].profileUrl).toBe('Duplicate Notebook profileUrl');
			expect(result[0].notebookId).toBe(notebookId);
			expect(result[0].userId).toBe(userId);
		});

		it('Throw Exception: Try to delete other users notebook review', async () => {
			let error: HttpException;
			try {
				await reviewService.deleteNotebookReview(reviewId, 'UnauthorizedUserId');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User does not have access to delete specified review.');
		});

		it('Throw Exception: Try to delete other users notebook review', async () => {
			const result = await reviewService.deleteNotebookReview(reviewId, userId);

			expect(result.message).toBe('Successfully delete a review!');
		});
	});

	describe('Note Review Service Tests', () => {
		it('Get reviews for notebook with no reviews', async () => {
			const result = await reviewService.getNoteReviews(noteId);

			expect(result).toStrictEqual([]);
		});

		it('Add note review', async () => {
			const addNoteReviewDto: AddNoteReviewDto = {
				noteId,
				message: 'Test Note message',
				rating: 5,
				displayName: 'Test Note displayName',
				profileUrl: 'Test Note profileUrl',
			};
			const result = await reviewService.addNoteReview(addNoteReviewDto, userId);

			expect(result.message).toStrictEqual('Successfully added a review to a note!');
		});

		it('Get reviews for note with one reviews', async () => {
			const result = await reviewService.getNoteReviews(noteId);

			console.log(result);

			reviewId = result[0].reviewId;

			expect(result.length).toBe(1);
			expect(result[0].displayName).toBe('Test Note displayName');
			expect(result[0].message).toBe('Test Note message');
			expect(result[0].rating).toBe(5);
			expect(result[0].profileUrl).toBe('Test Note profileUrl');
			expect(result[0].noteId).toBe(noteId);
			expect(result[0].userId).toBe(userId);
		});

		it('Try to create duplicate review, should override old review', async () => {
			const addNoteReviewDto: AddNoteReviewDto = {
				noteId,
				message: 'Duplicate Note message',
				rating: 1,
				displayName: 'Duplicate Note displayName',
				profileUrl: 'Duplicate Note profileUrl',
			};
			const result = await reviewService.addNoteReview(addNoteReviewDto, userId);

			expect(result.message).toStrictEqual('Successfully added a review to a note!');
		});

		it('Check if review update and if there are no duplicates', async () => {
			const result = await reviewService.getNoteReviews(noteId);

			expect(result.length).toBe(1);
			expect(result[0].displayName).toBe('Duplicate Note displayName');
			expect(result[0].message).toBe('Duplicate Note message');
			expect(result[0].rating).toBe(1);
			expect(result[0].profileUrl).toBe('Duplicate Note profileUrl');
			expect(result[0].noteId).toBe(noteId);
			expect(result[0].userId).toBe(userId);
		});

		it('Throw Exception: Try to delete other users note review', async () => {
			let error: HttpException;
			try {
				await reviewService.deleteNoteReview(reviewId, 'UnauthorizedUserId');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('User does not have access to delete specified review relating to this note.');
		});

		it('Throw Exception: Try to delete other users note review', async () => {
			const result = await reviewService.deleteNoteReview(reviewId, userId);

			expect(result.message).toBe('Successfully delete a note review!');
		});
	});

	describe('Remove Setup for Notebook', () => {
		it('Delete Notebook', async () => {
			const result = await notebookService.deleteNotebook(notebookId, userId);

			expect(result.message).toBe('Successfully delete notebook!');
		});
	});
});
