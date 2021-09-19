import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
// eslint-disable-next-line import/no-duplicates
import { exposeMockFirebaseAdminApp } from 'mock-firebase-ts';
import { UserService } from './user.service';

const app = admin.initializeApp();
const userDTo = require('./dto/userRequest.dto');

const mocked = exposeMockFirebaseAdminApp(app);
mocked.firestore().mocker.loadCollection('users', {
	userOne: {
		dateJoined: 'date 1',
		department: 'Test department1',
		institution: 'test institution1',
		username: 'test Name1',
		program: 'Test program1',
		uid: 'UserIdTest1',
		workStatus: 'test status1',
	},
	userTwo: {
		dateJoined: 'test date here1',
		department: 'Test department2',
		institution: 'test institution2',
		username: 'test Name2',
		program: 'Test program2',
		uid: 'UserIdTest2',
		workStatus: 'test status2',
	},
});

describe('UserService', () => {
	let service: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService],
		}).compile();

		service = module.get<UserService>(UserService);
		mocked.firestore().mocker.loadCollection('users', {
			userOne: {
				dateJoined: 'date 1',
				department: 'Test department1',
				institution: 'test institution1',
				username: 'test Name1',
				program: 'Test program1',
				uid: 'UserIdTest1',
				workStatus: 'test status1',
			},
			userTwo: {
				dateJoined: 'test date here1',
				department: 'Test department2',
				institution: 'test institution2',
				username: 'test Name2',
				program: 'Test program2',
				uid: 'UserIdTest2',
				workStatus: 'test status2',
			},
		});
	});
	afterEach(() => {
		mocked.firestore().mocker.reset();
	});
	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('updateUser', () => {
		it('Test should update a user successfully', async () => {
			userDTo.UserRequestDto = jest.fn(() => [
				{
					bio: 'TestBio',
					dateJoined: 'test date here',
					department: 'Test department',
					institution: 'test institution',
					name: 'test New Name',
					program: 'Test program',
					uid: 'UserIdTest',
					workStatus: 'test status',
				},
			]);
			const result = await service.updateUser(userDTo.UserRequestDto, 'userOne');
			expect(result.message).toBe('User successfully updated');
		});

		it('Test should not  update a user ', async () => {
			userDTo.UserRequestDto2 = {
				bio: 'TestBio',
				dateJoined: 'test date here',
				department: 'Test department',
				institution: 'test institution',
				username: null,
				program: 'Test program',
				uid: 'UserIdTest',
				workStatus: 'test status',
			};

			const result = await service.updateUser(userDTo.UserRequestDto2, 'userOne1');
			expect(result.message).toBe('User unsuccessfully updated');
		});
	});

	describe('createUser', () => {
		it('Test should create a user successfully', async () => {
			userDTo.UserRequestDto = jest.fn(() => [
				{
					bio: 'TestBio',
					dateJoined: 'test date here',
					department: 'Test department',
					institution: 'test institution',
					name: 'test New Name',
					program: 'Test program',
					uid: 'UserIdTest',
					workStatus: 'test status',
				},
			]);
			const result = await service.createUser(userDTo.UserRequestDto, 'userOne');
			expect(result.message).toBe('User successfully created');
		});

		it('Test should not  register a user ', async () => {
			userDTo.UserRequestDto2 = {
				bio: 'TestBio',
				dateJoined: 'test date here',
				department: 'Test department',
				institution: 'test institution',
				username: 'test Name1',
				program: 'Test program',
				uid: 'UserIdTest',
				workStatus: 'test status',
			};

			const result = await service.createUser(userDTo.UserRequestDto2, 'fakeusertestid');
			expect(result.message).toBe('User unsuccessfully updated');
		});
	});

	describe('doesUsernameExist', () => {
		describe('checks if a user has already registered with that name', () => {
			it('Compare a name in the database', async () => {
				const response = await service.doesUsernameExist('test Name1');
				expect(response).toBe(true);
			});

			it('Compare a name that does not exist', async () => {
				const response = await service.doesUsernameExist('test Name');
				expect(response).toBe(false);
			});
		});
	});

	describe('deleteUserProfile', () => {
		it('Test should delete the user profile', async () => {
			const result = await service.deleteUserProfile('userOne');
			expect(result.message).toBe('User profile was successfully deleted');
		});
	});
});
