import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotebookService } from '../notebook/notebook.service';
import { AccountService } from './account.service';
import { NotebookController } from '../notebook/notebook.controller';
import { NoteService } from '../notebook/note/note.service';
import { ReviewService } from '../notebook/review/review.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { AccessService } from '../notebook/access/access.service';
import { NotificationService } from '../notification/notification.service';

const serviceAccount = require('../../service_account.json');

// eslint-disable-next-line import/order
const test = require('firebase-functions-test')();

test.mockConfig({
	email: {
		user: 'smartstudent.handbook@gmail.com',
		pass: 'SmartStudent01!',
	},
});

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

describe('Account Service Integration Testing', () => {
	let accountService: AccountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [
				NotebookService,
				AccountService,
				NoteService,
				ReviewService,
				AuthService,
				UserService,
				AccessService,
				NotificationService,
			],
		}).compile();
		//
		accountService = module.get<AccountService>(AccountService);

		jest.setTimeout(30000);
	});

	it('Account Service should be defined', () => {
		expect(accountService).toBeDefined();
	});

	describe('User Registration Integration Testing', () => {
		it('Register User Successfully', async () => {
			const num = Math.floor(Math.random() * 100000 + 1);
			const registerDto = {
				email: `testuser${num}@gmail.com`,
				username: `testuser${num}`,
				password: 'TestPassword101*',
				passwordConfirm: 'TestPassword101*',
				isLocalhost: true,
			};

			const result = await accountService.registerUser(registerDto);

			expect(result.success).toBe(true);
		});

		it('Register User Unsuccessfully', async () => {
			const num = Math.floor(Math.random() * 100000 + 1);
			const registerDto = {
				email: `testuser${num}@gmail.com`,
				username: `testuser${num}`,
				password: 'TestPassword101*',
				passwordConfirm: 'TestPassword101',
				isLocalhost: true,
			};

			const result = await accountService.registerUser(registerDto);

			expect(result.success).toBe(false);
		});
	});

	describe('User Login Integration Testing', () => {
		it('Login User Successfully', async () => {
			const loginDto = {
				email: 'testuserlogin@gmail.com',
				password: 'TestPassword101*',
			};

			const result = await accountService.loginUser(loginDto);

			expect(result.success).toBe(true);
		});

		it('Login User Unsuccessfully', async () => {
			const loginDto = {
				email: 'testuserlogin@gmail.com',
				password: 'TestPassword102*',
			};

			const result = await accountService.loginUser(loginDto);

			expect(result.success).toBe(false);
		});
	});

	describe('Get Current User Integration Testing', () => {
		it('Get Current User', async () => {
			const loginDto = {
				email: 'testuserlogin@gmail.com',
				password: 'TestPassword101*',
			};

			const user = await accountService.loginUser(loginDto);
			const id = user.user.uid;

			const result = await accountService.getCurrentUser(id);

			expect(result.success).toBe(true);
			expect(result.user.uid).toBe(id);
			expect(result.user.email).toBe(user.user.email);
		});
	});
});
