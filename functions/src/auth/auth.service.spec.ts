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
	databaseURL: 'https://smartstudenthandboook-dev-default-rtdb.firebaseio.com',
});

const firebaseConfig = {
	apiKey: 'AIzaSyCsXWdPjNUqLsDCp05RpY3-J8Mtb9P11JM',
	authDomain: 'smartstudenthandboook-dev.firebaseapp.com',
	databaseURL: 'https://smartstudenthandboook-dev-default-rtdb.firebaseio.com',
	projectId: 'smartstudenthandboook-dev',
	storageBucket: 'smartstudenthandboook-dev.appspot.com',
	messagingSenderId: '953003868912',
	appId: '1:953003868912:web:5c91964eb8289263253835',
	measurementId: 'G-V286FE7KN8',
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

	describe('Check services are defined', () => {
		it('Account Service should be defined', () => {
			expect(accountService).toBeDefined();
		});

		it('Auth Service should be defined', () => {
			expect(authService).toBeDefined();
		});
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
