import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { mockCollection, mockSet } from 'firestore-jest-mock/mocks/firestore';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserByUsernameDto } from './dto/userByUsername.dto';

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
				const user: UserByUsernameDto = {
					username: 'TestName',
				};
				await service.getUserByUsername(user);
				expect(mockCollection).toHaveBeenCalledWith('users');
			});
		});

		describe('This should  not retrieve the user details with the current uid', () => {
			it('if uid is not valid return error message', () =>
				// eslint-disable-next-line
 				expect(service.getUserByUid('wrong ud ')).rejects.toThrow(HttpException));
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

				await service.createAndUpdateUser(userDTo.UserRequestDto, 'UserIdTest');
				expect(mockCollection).toHaveBeenCalledWith('users');
				expect(mockSet).toHaveBeenCalled();
			});
		});
	});

	describe('createUser', () => {
		it('Test should register a user successfully', async () => {
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
			const result = await service.createUser(userDTo.UserRequestDto, 'UserIdTest');

			expect(result.message).toBe('User unsuccessfully updated');
		});
	});
});
