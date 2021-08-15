import { Test, TestingModule } from '@nestjs/testing';
import MockDate from 'mockdate';
import { AccountService } from './account.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

const registerDTO = require('./dto/register.dto');

// admin.initializeApp();

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
	let serviceUser: UserService;
	/* const mockFirestoreProperty = admin => {
		const auth = jest.fn();
		Object.defineProperty(admin, 'auth', {
			get: jest.fn(() => auth),
			configurable: true
		});
	}; */

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccountService, NotificationService, UserService],
		}).compile();

		serviceAccount = module.get<AccountService>(AccountService);
		serviceNotification = module.get<NotificationService>(NotificationService);
		serviceUser = module.get<UserService>(UserService);
		// mockFirestoreProperty(admin);
		// admin.auth=jest.fn();
	});

	it('should be defined', () => {
		expect(serviceAccount).toBeDefined();
		expect(serviceNotification).toBeDefined();
		expect(serviceUser).toBeDefined();
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

			const codeSplit = decodedCode.split('.');

			expect(codeSplit.length).toBe(5);
			expect(codeSplit[0]).toBe('974853000000');
			expect(codeSplit[1]).toBe('iHTCHLd8');
			expect(`${codeSplit[2]}.${codeSplit[3]}`).toBe('test@gmail.com');
		});

		it('The check code should be calculated correctly', () => {
			MockDate.set('2000-11-22');

			const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
			const decodedCode = Buffer.from(code, 'base64').toString();

			const codeSplit = decodedCode.split('.');

			let checkSum = 0;
			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < 7; i++) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				checkSum += Number(codeSplit[4].charAt(i));
			}
			const checkNum = checkSum.toString().charAt(checkSum.toString().length - 1);

			expect(codeSplit[4].charAt(7)).toBe(checkNum);
		});
	});

	describe('Reset Password Decode Code', () => {
		it('It should decode the code correctly', () => {
			// eslint-disable-next-line max-len
			const code = serviceAccount.decodeSecureCode('OTc0ODUzMDAwMDAwLmlIVENITGQ4LnRlc3RAZ21haWwuY29tLjg1MzE3NTMy');

			expect(code.email).toBe('test@gmail.com');
			expect(code.timeExpire).toBe(974853000000);
			expect(code.uid).toBe('iHTCHLd8');
			expect(code.checksumPassed).toBe(true);
		});
	});
});
