describe('AccountService', () => {
	it('Do Tests', async () => {});
});

// import { Test, TestingModule } from '@nestjs/testing';
// import MockDate from 'mockdate';
// import * as admin from 'firebase-admin';
// import firebase from 'firebase';
// import { AccountService } from './account.service';
// import { NotificationService } from '../notification/notification.service';
// import { UserService } from '../user/user.service';
// //
// // const registerDTO = require('./dto/register.dto');
//
// const serviceAccountKeys = require('../../service_account.json');
//
// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccountKeys),
// 	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
// });
//
// const firebaseConfig = {
// 	apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
// 	authDomain: 'smartstudentnotebook.firebaseapp.com',
// 	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
// 	projectId: 'smartstudentnotebook',
// 	storageBucket: 'smartstudentnotebook.appspot.com',
// 	messagingSenderId: '254968215542',
// 	appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
// 	measurementId: 'G-YDRCWDT5QJ',
// };
// firebase.initializeApp(firebaseConfig);
//
// describe('AccountService', () => {
// 	let serviceAccount: AccountService;
// 	let serviceNotification: NotificationService;
// 	let serviceUser: UserService;
//
// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [AccountService, NotificationService, UserService],
// 		}).compile();
//
// 		serviceAccount = module.get<AccountService>(AccountService);
// 		serviceNotification = module.get<NotificationService>(NotificationService);
// 		serviceUser = module.get<UserService>(UserService);
//
// 		jest.setTimeout(30000);
// 	});
//
// 	it('should be defined', () => {
// 		expect(serviceAccount).toBeDefined();
// 		expect(serviceNotification).toBeDefined();
// 		expect(serviceUser).toBeDefined();
// 	});
//
// 	describe('Register User', () => {
// 		it('Should fail password do not match', async () => {
// 			const registerUser = {
// 				email: 'Test@gmail.com',
// 				username: 'UserTestName',
// 				password: 'TestPassword!0',
// 				passwordConfirm: 'TestPasswor',
// 				isLocalhost: false,
// 			};
//
// 			const results = await serviceAccount.registerUser(registerUser);
//
// 			expect(results.error).toEqual('Passwords dont match');
// 			expect(results.message).toEqual('User is unsuccessfully registered:');
// 			expect(results.success).toEqual(false);
// 		});
//
// 		it('Should fail invalid email', async () => {
// 			const registerUser = {
// 				email: 'TestGmail.com',
// 				username: 'UserTestName',
// 				password: 'TestPassword!0',
// 				passwordConfirm: 'TestPassword!0',
// 				isLocalhost: false,
// 			};
//
// 			const results = await serviceAccount.registerUser(registerUser);
//
// 			expect(results.error).toEqual('Email or Password does not meet the requirements');
// 			expect(results.message).toEqual('User is unsuccessfully registered:');
// 			expect(results.success).toEqual(false);
// 		});
//
// 		it('Should register user', async () => {
// 			const registerUser = {
// 				email: 'TestUserAccount@gmail.com',
// 				username: 'UserTestNameAccount',
// 				password: 'TestPassword!0',
// 				passwordConfirm: 'TestPassword!0',
// 				isLocalhost: false,
// 			};
//
// 			const results = await serviceAccount.registerUser(registerUser);
//
// 			expect(results.message).toEqual('User is successfully registered!');
// 			expect(results.success).toEqual(true);
// 		});
//
// 		// it('Should fail cannot double register a user', async () => {
// 		// 	const registerUser = {
// 		// 		email: 'TestUserAccount@gmail.com',
// 		// 		username: 'UserTestNameAccount',
// 		// 		password: 'TestPassword!0',
// 		// 		passwordConfirm: 'TestPassword!0',
// 		// 		isLocalhost: false,
// 		// 	};
// 		//
// 		// 	const results = await serviceAccount.registerUser(registerUser);
// 		//
// 		// 	expect(results.message).toEqual('User is unsuccessfully registered');
// 		// 	expect(results.success).toEqual(false);
// 		// });
// 	});
//
// 	describe('loginUser', () => {
// 		it('Test should login a user', async () => {
// 			const user = {
// 				email: 'TestUserAccount@gmail.com',
// 				password: 'TestPassword!0',
// 			};
//
// 			const result = await serviceAccount.loginUser(user);
//
// 			expect(result.message).toBe('User is successfully logged in!');
// 		});
// 	});
//
// 	describe('Update User', () => {
// 		it('It should decode the code correctly', async () => {
// 			const updateUser = {
// 				email: 'TestUserAccount@gmail.com',
// 				displayName: 'UserTestName',
// 				password: 'TestPassword!0',
// 				passwordConfirm: 'TestPassword!0',
// 				isLocalhost: false,
// 				username: 'UserTestName',
// 				institution: 'Test Institution',
// 				department: 'Test Department',
// 				program: 'Test Program',
// 				workStatus: 'Test WorkStatus',
// 				bio: 'Test bio',
// 				profilePicUrl: 'TestUrl',
// 			};
//
// 			const results = await serviceAccount.updateUser(updateUser);
//
// 			expect(results.message).toEqual('User is successfully Updated!');
// 			expect(results.success).toEqual(true);
// 		});
// 	});
//
// 	describe('Get Current User', () => {
// 		it('This should return the user that is currently logged in', async () => {
// 			const results = await serviceAccount.getCurrentUser();
//
// 			expect(results.message).toEqual('User is successfully logged in.');
// 			expect(results.success).toEqual(true);
// 		});
// 	});
//
// 	describe('Reset Password Encode Code', () => {
// 		it('It should return code', () => {
// 			MockDate.set('2000-11-22');
//
// 			const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
// 			expect(code).toBeDefined();
// 		});
//
// 		it('The code should have the correct data', () => {
// 			MockDate.set('2000-11-22');
//
// 			const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
// 			const decodedCode = Buffer.from(code, 'base64').toString();
//
// 			const codeSplit = decodedCode.split('.');
//
// 			expect(codeSplit.length).toBe(5);
// 			expect(codeSplit[0]).toBe('974853000000');
// 			expect(codeSplit[1]).toBe('iHTCHLd8');
// 			expect(`${codeSplit[2]}.${codeSplit[3]}`).toBe('test@gmail.com');
// 		});
//
// 		it('The check code should be calculated correctly', () => {
// 			MockDate.set('2000-11-22');
//
// 			const code = serviceAccount.encodeSecureCode('iHTCHLd8kLMBfOXtuMHZbYXSq4v2', 'test@gmail.com');
// 			const decodedCode = Buffer.from(code, 'base64').toString();
//
// 			const codeSplit = decodedCode.split('.');
//
// 			let checkSum = 0;
// 			// eslint-disable-next-line no-plusplus
// 			for (let i = 0; i < 7; i++) {
// 				// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 				checkSum += Number(codeSplit[4].charAt(i));
// 			}
// 			const checkNum = checkSum.toString().charAt(checkSum.toString().length - 1);
//
// 			expect(codeSplit[4].charAt(7)).toBe(checkNum);
// 		});
// 	});
//
// 	describe('Reset Password Decode Code', () => {
// 		it('It should decode the code correctly', () => {
// eslint-disable-next-line max-len
// 			const code = serviceAccount.decodeSecureCode('OTc0ODUzMDAwMDAwLmlIVENITGQ4LnRlc3RAZ21haWwuY29tLjg1MzE3NTMy');
//
// 			expect(code.email).toBe('test@gmail.com');
// 			expect(code.timeExpire).toBe(974853000000);
// 			expect(code.uid).toBe('iHTCHLd8');
// 			expect(code.checksumPassed).toBe(true);
// 		});
// 	});
//
// 	describe('Delete User', () => {
// 		it('This should delete the currently logged in user', async () => {
// 			const results = await serviceAccount.deleteUser();
//
// 			expect(results.message).toEqual('Successfully deleted user!');
// 		});
// 	});
// });
