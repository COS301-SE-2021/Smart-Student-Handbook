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

import { UserService } from './user.service';
import { UserRequestDto } from './dto/userRequest.dto';

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
				name: 'test Name',
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
				expect(service.getUserDetails('wrong ud ')).rejects.toThrow());
		});
	});

	describe('CreateAndUpdateUser', () => {
		describe('Creates and updates a user', () => {
			it('Genreate a new user and create the user', async () => {
				userDTo.UserRequestDto = jest.fn(() => [
					{
						bio: 'TestBio',
						dateJoined: 'test date here',
						department: 'Test department',
						institution: 'test institution',
						name: 'test Name',
						program: 'Test program',
						uid: 'UserIdTest',
						workStatus: 'test status',
					},
				]);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				await service.createAndUpdateUser(UserRequestDto);
				expect(mockCollection).toHaveBeenCalledWith('users');
				expect(mockSet).toHaveBeenCalled();
			});
		});
	});
});
