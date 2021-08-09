import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
// import { mockCollection } from 'firestore-jest-mock/mocks/firestore';
// import { mockCreateUserWithEmailAndPassword } from 'firestore-jest-mock/mocks/auth';
import { HttpException } from '@nestjs/common';

import firebase from 'firebase';
import { AccountService } from './account.service';

admin.initializeApp();
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
const registerDTO = require('./dto/register.dto');

mockGoogleCloudFirestore({
	database: {
		users: [],
	},
});

describe('AccountService', () => {
	let service: AccountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AccountService],
		}).compile();

		service = module.get<AccountService>(AccountService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
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

				await expect(service.registerUser(registerDTO)).rejects.toThrowError();
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
				await expect(service.registerUser(registerDTO)).rejects.toThrow(HttpException);
			});
		});
	});
});
