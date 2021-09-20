import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { ReviewService } from './review.service';

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
		notebookAccess: [
			{
				displayName: 'Test Display Name',
				userId: 'UserIdTest',
				profileUrl: 'Test Profile Url',
				notebookId: 'NotebookId',
			},
		],
	},
});
const notebookId = 'NotebookID';
const userId = 'UserID';
describe('ReviewService', () => {
	let service: ReviewService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ReviewService],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Notebook Reviews', () => {
		it('Add Reviews to a notebook', async () => {
			const review = {
				notebookId,
				message: 'Test review message',
				rating: 8,
				displayName: 'TestAccount1',
				userId,
				profileUrl: 'Test Profile Url',
			};
			const result = await service.addNotebookReview(review, userId);

			expect(result.message).toBe('Successfully added a review!');
		});

		it('Get Notebook Reviews', async () => {
			const result = await service.getNotebookReviews(notebookId);

			expect(result.length).toBe(0);
		});

		it('Try to Access Invalid Notebook', async () => {
			let result;
			try {
				result = await service.getNotebookReviews('ImpossibleIdNumber');
			} catch (e) {
				result = e;
			}

			expect(result).toStrictEqual([]);
		});

		it('Add Reviews to a notebook', async () => {
			let result;
			try {
				result = await service.deleteNotebookReview(notebookId, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe("Cannot read property 'userId' of undefined");
		});
	});
});
