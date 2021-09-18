import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';
import { EmailInterface } from './interfaces/email.interface';

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

describe('Notifications Service Integration Tests', () => {
	let notificationService: NotificationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NotificationService],
		}).compile();

		notificationService = module.get<NotificationService>(NotificationService);

		jest.setTimeout(30000);
	});

	describe('Check services are defined', () => {
		it('Notification Service should be defined', () => {
			expect(notificationService).toBeDefined();
		});
	});

	describe('Setup Notebook for testing', () => {
		it('Test successfully create a notebook', async () => {
			const email: EmailInterface = {
				email: 'louw707@gmail.com',
				subject: 'Notifications test subject',
				body: 'Notifications test body',
			};
			const result = await notificationService.sendEmailNotification(email);

			expect(result.success).toBe(true);
		});
	});
});
