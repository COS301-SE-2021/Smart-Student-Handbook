import { Test, TestingModule } from '@nestjs/testing';
import MockDate from 'mockdate';
import * as admin from 'firebase-admin';
import { AccountService } from './account.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

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
	},
});

admin.initializeApp();

describe('AccountService', () => {
	let serviceAccount: AccountService;
	let serviceNotification: NotificationService;
	let serviceUser: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccountService, NotificationService, UserService, AuthService],
		}).compile();

		serviceAccount = module.get<AccountService>(AccountService);
		serviceNotification = module.get<NotificationService>(NotificationService);
		serviceUser = module.get<UserService>(UserService);

		jest.setTimeout(30000);
	});

	it('should be defined', () => {
		expect(serviceAccount).toBeDefined();
		expect(serviceNotification).toBeDefined();
		expect(serviceUser).toBeDefined();
	});

	describe('Register User', () => {
		it('Should fail password do not match', async () => {
			const registerUser = {
				email: 'Test@gmail.com',
				username: 'UserTestName',
				password: 'TestPassword!0',
				passwordConfirm: 'TestPasswor',
				isLocalhost: false,
			};

			const results = await serviceAccount.registerUser(registerUser);

			expect(results.error).toEqual('Passwords dont match');
			expect(results.message).toEqual('User is unsuccessfully registered:');
			expect(results.success).toEqual(false);
		});

		it('Should fail invalid email', async () => {
			const registerUser = {
				email: 'TestGmail.com',
				username: 'UserTestName',
				password: 'TestPassword!0',
				passwordConfirm: 'TestPassword!0',
				isLocalhost: false,
			};

			const results = await serviceAccount.registerUser(registerUser);

			expect(results.error).toEqual('Email or Password does not meet the requirements');
			expect(results.message).toEqual('User is unsuccessfully registered:');
			expect(results.success).toEqual(false);
		});

		it('Should register user', async () => {
			const registerUser = {
				email: 'TestUserAccount@gmail.com',
				username: 'UserTestNameAccount',
				password: 'TestPassword!0',
				passwordConfirm: 'TestPassword!0',
				isLocalhost: false,
			};

			const results = await serviceAccount.registerUser(registerUser);

			expect(results.message).toEqual('User is unsuccessfully registered');
			expect(results.success).toEqual(false);
		});

		describe('loginUser', () => {
			it('Test should login a user', async () => {
				const user = {
					email: 'TestUserAccount@gmail.com',
					password: 'TestPassword!0',
				};

				const result = await serviceAccount.loginUser(user);

				expect(result.message).toBe('Login failed, please try again!');
			});
		});

		describe('Update User', () => {
			it('It should decode the code correctly', async () => {
				const updateUser = {
					email: 'TestUserAccount@gmail.com',
					displayName: 'UserTestName',
					password: 'TestPassword!0',
					passwordConfirm: 'TestPassword!0',
					isLocalhost: false,
					username: 'UserTestName',
					institution: 'Test Institution',
					department: 'Test Department',
					program: 'Test Program',
					workStatus: 'Test WorkStatus',
					bio: 'Test bio',
					profilePicUrl: 'TestUrl',
				};

				const results = await serviceAccount.updateUser(updateUser, 'UserID');

				expect(results.message).toEqual('Something went wrong, user was not updated!');
				expect(results.success).toEqual(false);
			});
		});

		describe('Get Current User', () => {
			it('This should return the user that is currently logged in', async () => {
				const results = await serviceAccount.getCurrentUser('UserID');

				expect(results.message).toEqual('User is not logged in.');
				expect(results.success).toEqual(false);
			});
		});

		describe('Reset Password Encode Code', () => {
			it('It should return code', () => {
				MockDate.set('2000-11-22');

				const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
				expect(code).toBeDefined();
			});

			it('The code should have the correct data', () => {
				MockDate.set('2000-11-22');

				const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
				const decodedCode = Buffer.from(code, 'base64').toString();

				const codeSplit = decodedCode.split('...');

				expect(codeSplit.length).toBe(4);
				expect(codeSplit[0]).toBe('974853000000');
				expect(codeSplit[1]).toBe('iHTCHLd8');
				expect(`${codeSplit[2]}`).toBe('test@gmail.com');
			});

			it('The check code should be calculated correctly', () => {
				MockDate.set('2000-11-22');

				const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
				const decodedCode = Buffer.from(code, 'base64').toString();
				const codeSplit = decodedCode.split('...');

				let checkSum = 0;
				// eslint-disable-next-line no-plusplus
				for (let i = 0; i < 7; i++) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					checkSum += Number(codeSplit[3].charAt(i));
				}
				const checkNum = checkSum.toString().charAt(checkSum.toString().length - 1);

				expect(codeSplit[3].charAt(7)).toBe(checkNum);
			});
		});

		describe('Reset Password Decode Code', () => {
			it('It should decode the code correctly', () => {
				// eslint-disable-next-line max-len
				const code = serviceAccount.decodeSecureCode(
					'OTc0ODUzMDAwMDAwLi4uaUhUQ0hMZDguLi50ZXN0QGdtYWlsLmNvbS4uLjMwNzQ2NzQx',
				);

				expect(code.email).toBe('test@gmail.com');
				expect(code.timeExpire).toBe(974853000000);
				expect(code.uid).toBe('iHTCHLd8');
				expect(code.checksumPassed).toBe(true);
			});
		});
	});
});
