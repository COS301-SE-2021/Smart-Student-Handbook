import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import {
	mockCollection,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	mockDelete,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	mockDoc,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	mockGet,
	mockSet,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	mockWhere,
} from 'firestore-jest-mock/mocks/firestore';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';

admin.initializeApp();
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const userDTo = require('./dto/userRequest.dto');

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
	},
});

describe('UserService', () => {
	let service: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getUserDetails', () => {
		describe('This should retrieve the user details with the current uid', () => {
			it('if uid is valid return user details', async () => {
				// await service.getUserDetails("UserIdTest");
				// expect(mockCollection).toHaveBeenCalledWith('users');
				// expect(mockWhere).toHaveBeenCalledWith("uid", "==", "UserIdTest");
			});
		});
		describe('This should  not retrieve the user details with the current uid', () => {
			it('if uid is not valid return error message', () =>
				// eslint-disable-next-line
 				expect(service.getUserByUid('wrong ud ')).rejects.toThrow(HttpException));
		});
	});

	describe('CreateAndUpdateUser', () => {
		console.log(mockGoogleCloudFirestore.name);
		describe('Creates and updates a user', () => {
			it('Genreate a new user and create the user', async () => {
				userDTo.UserRequestDto1 = {
					bio: 'TestBio',
					dateJoined: 'test date here',
					department: 'Test department',
					institution: 'test institution',
					userName: 'test',
					program: 'Test program',
					uid: 'UserIdTest',
					workStatus: 'test status',
				};

				const result = await service.createAndUpdateUser(userDTo.UserRequestDto1, 'fakeusertestid');
				expect(result.message).toBe('User was successfully added');
				expect(mockCollection).toHaveBeenCalledWith('users');
				expect(mockSet).toHaveBeenCalled();
			});
		});
	});

	describe('doesUsernameExist', () => {
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
			},
		});
		describe('checks if a user has already registered with that name', () => {
			it('Compare a name in the database', async () => {
				 await service.doesUsernameExist('test Name');
				expect(mockCollection).toHaveBeenCalledWith('users');
			});

		});
	});

	describe('CreateUser', () => {
		it('Test should register a user successfully', async () => {
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
			// const result = await service.createUser(userDTo.UserRequestDto, 'fakeusertestid');
			// expect(result.message).toBe('User was successfully added');
			// expect(mockCollection).toHaveBeenCalledWith('users');
			// expect(mockSet).toHaveBeenCalled();
		});
	});
});
