import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { AccessService } from './access.service';

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

const userId = 'UserID';
const notebookId = 'notebookId';

describe('AccessService', () => {
	let service: AccessService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccessService],
		}).compile();

		service = module.get<AccessService>(AccessService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Notebook Access', () => {
		it('Add Access to Notebook', async () => {
			const access = {
				displayName: 'Test Display Name',
				userId: 'Test userId',
				profileUrl: 'Test Profile Url',
				notebookId,
			};
			let error: HttpException;

			try {
				await service.addAccess(access, userId);
			} catch (e) {
				error = e;
			}
			expect(error.message).toBe('User is not authorized to add user access to notebook.');
		});

		it('Get Access List', async () => {
			const result = await service.getAccessList(notebookId);

			expect(result.length).toBe(0);
		});

		it('Remove user Access Not Authorized', async () => {
			let result;
			const access = {
				userId,
				creatorId: 'Test userId',
				username: 'Test userName',
				notebookId,
				accessId: '1',
			};

			try {
				result = await service.removeUserAccess(access, userId);
			} catch (e) {
				result = e;
			}

			expect(result.message).toBe('User is not authorized to remove user access to the specified notebook.');
		});
	});
});
