import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { exposeMockFirebaseAdminApp } from 'mock-firebase-ts';
import { AccessService } from './access.service';

const app = admin.initializeApp();
const mocked = exposeMockFirebaseAdminApp(app);
mocked.firestore().mocker.loadCollection('notebookAccess', {
	userOne: {
		accessID: 'number 1',
		displayName: 'TestName',
		notebookID: 'testNotebook',
		profileUrl: 'url1',
		userId: 'testUserID',
	},
	userTwo: {
		accessID: 'number 2',
		displayName: 'TestName2',
		notebookID: 'testNotebook',
		profileUrl: 'url2',
		userId: 'testUserID2',
	},
});

describe('AccessService', () => {
	let service: AccessService;
	afterEach(() => {
		mocked.firestore().mocker.reset();
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccessService],
		}).compile();
		service = module.get<AccessService>(AccessService);
		mocked.firestore().mocker.loadCollection('notebookAccess', {
			userOne: {
				accessID: 'number 1',
				displayName: 'TestName',
				notebookID: 'testNotebook',
				profileUrl: 'url1',
				userId: 'UserID',
			},
			userTwo: {
				accessID: 'number 2',
				displayName: 'TestName2',
				notebookID: 'testNotebook',
				profileUrl: 'url2',
				userId: 'testUserID2',
			},
		});
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getAccessList', () => {
		it('This function should return al user that have access to the notebook ', async () => {
			const result = await service.getAccessList('testNotebook');
			expect(result).toStrictEqual([]);
		});
	});

	describe('checkUserAccess', () => {
		it('This function should check if a user has access to the notebook', async () => {
			const result = await service.checkUserAccess('testNotebook', 'UserID');
			expect(result).toStrictEqual(false);
		});
	});

	describe('checkUserAccess', () => {
		it('This function should check if a user has access to the notebook', async () => {
			const result = await service.checkUserAccess('testNotebook', 'UserID');
			expect(result).toStrictEqual(true);
		});
	});
});
