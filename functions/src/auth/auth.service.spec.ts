import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from './auth.service';

const serviceAccount = require('../../service_account.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
});

const firebaseConfig = {
	apiKey: 'AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0',
	authDomain: 'smartstudentnotebook.firebaseapp.com',
	databaseURL: 'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'smartstudentnotebook',
	storageBucket: 'smartstudentnotebook.appspot.com',
	messagingSenderId: '254968215542',
	appId: '1:254968215542:web:be0931c257ad1d8a60b9d7',
	measurementId: 'G-YDRCWDT5QJ',
};
firebase.initializeApp(firebaseConfig);

describe('Auth Service Tests', () => {
	let accountService: AccountService;
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [],
			providers: [AccountService, AuthService, UserService, NotificationService],
		}).compile();
		//
		accountService = module.get<AccountService>(AccountService);
		authService = module.get<AuthService>(AuthService);

		jest.setTimeout(30000);
	});

	describe('Login user to be used', () => {
		it('Should login a user successfully', async () => {
			const user = {
				email: 'test-user-review@smartstudenthandbook.co.za',
				password: 'TestPassword01!',
			};

			const userData = await accountService.loginUser(user);

			const result = await authService.verifyUser(userData.authToken);

			expect(result).toBe('BvzwT1hKTETNLvXeCMgxinOm0GH3');
		});

		it('Throw Exception: Invalid JWT token', async () => {
			let error: HttpException;

			try {
				await authService.verifyUser('Invalid JWT token');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('Was unable to authenticate user. Invalid token!');
		});
	});
});
