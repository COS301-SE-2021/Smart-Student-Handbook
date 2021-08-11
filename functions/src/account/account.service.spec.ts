import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { NotificationService } from '../notification/notification.service';
// import firebase from 'firebase';
// import * as admin from 'firebase-admin';
const registerDTO = require('./dto/register.dto');

jest.mock('firebase-admin');

/* jest.mock('firebase-admin', () => {
	return {
		auth: jest.fn().mockImplementation(()=>{
			return {
				createUser: jest.fn().mockImplementation(()=>{
					return{
						then: jest.fn().mockImplementation(()=>{
							return{
								catch: jest.fn().mockImplementation(()=>{
									return{
										Promise: true
									}
								})
							}
						})

					}
				})
			};
		}),

	};
}); */

describe('AccountService', () => {
	let serviceAccount: AccountService;
	let serviceNotification: NotificationService;

	/* const mockFirestoreProperty = admin => {
		const auth = jest.fn();
		Object.defineProperty(admin, 'auth', {
			get: jest.fn(() => auth),
			configurable: true
		});
	}; */

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccountService, NotificationService],
		}).compile();

		serviceAccount = module.get<AccountService>(AccountService);
		serviceNotification = module.get<NotificationService>(NotificationService);
		// mockFirestoreProperty(admin);
		// admin.auth=jest.fn();
	});

	it('should be defined', () => {
		expect(serviceAccount).toBeDefined();
		expect(serviceNotification).toBeDefined();
	});

	// test registerUser
	describe('registerUser', () => {
		describe('The user will enter their details', () => {
			it('If all user details are entered correctly the user will be registered', async () => {
				registerDTO.RegisterDto = jest.fn(() => [
					{
						email: 'Test@gmail.com',
						phoneNumber: '0721234567',
						displayName: 'UserTestName',
						password: 'TestPassword',
						passwordConfirm: 'TestPassword',
					},
				]);
				const results = await serviceAccount.registerUser(registerDTO);
				await expect(results).toEqual('true');
			});
		});

		describe('The user will enter their details incorrectly', () => {
			it('If all user details are entered incorrectly the user will not be registered', async () => {
				registerDTO.RegisterDto = jest.fn(() => [
					{
						email: 'Test@gmail.com',
						phoneNumber: '0721234567',
						displayName: 'UserTestName',
						password: 'TestWrPasswords',
						passwordConfirm: 'TestPassword',
					},
				]);

				// Todo This should fail
				await expect(serviceAccount.registerUser(registerDTO)).rejects.toThrowError();
			});
		});
	});
});
