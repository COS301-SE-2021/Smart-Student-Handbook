import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotebookService } from './notebook.service';
import { AccessService } from './access/access.service';
import { NoteService } from './note/note.service';
import { NotebookController } from './notebook.controller';
import { AccountService } from '../account/account.service';
import { NotificationService } from '../notification/notification.service';

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

describe('NotebookIntegrationTests', () => {
	let notebookService: NotebookService;
	let accesService: AccessService;
	let accountService: AccountService;
	let noteService: NoteService;
	const randomNumber: number = Math.floor(Math.random() * 100000);
	const notebookId = '';
	const noteId = '';
	let userId = '';

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotebookController],
			providers: [NotebookService, AccessService, NoteService, NotificationService, AccountService],
		}).compile();
		//
		notebookService = module.get<NotebookService>(NotebookService);
		accountService = module.get<AccountService>(AccountService);

		jest.setTimeout(30000);
	});

	describe('loginUser', () => {
		it('Test should login a user', async () => {
			const user = {
				email: 'TestAccount82982@gmail.com',
				password: 'TestPassword01!',
			};

			const result = await accountService.loginUser(user);
			userId = result.user.uid;

			expect(result.message).toBe('User is successfully logged in!');
		});
	});
});
