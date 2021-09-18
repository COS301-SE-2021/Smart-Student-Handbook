import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';
import { EmailInterface } from './interfaces/email.interface';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';

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
	const userId = '0iIh3PKlKsTt702mxlbQyd1ZCG53';

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

	describe('Email Notification Testing', () => {
		it('Send Email Notification', async () => {
			const emailInterface: EmailInterface = {
				email: 'louw707@gmail.com',
				subject: 'Notifications test subject',
				body: 'Notifications test body',
			};
			const result = await notificationService.sendEmailNotification(emailInterface);

			expect(result.success).toBe(true);
		});
	});

	describe('PushNotification Testing', () => {
		it('Test Send Notification To Group', async () => {
			const sendNotificationToGroupRequestDto: SendNotificationToGroupRequestDto = {
				topic: 'Notifications-test-topic',
				title: 'Notifications test title',
				body: 'Notifications test body',
				userId,
			};
			const result = await notificationService.sendGroupPushNotification(sendNotificationToGroupRequestDto);

			expect(result.status).toBe('successful');
		});

		it('Test Single Notification', async () => {
			const singleNotificationRequestDto: SingleNotificationRequestDto = {
				token: 'invalidToken',
				title: 'Notifications test title',
				body: 'Notifications test body',
				userId,
			};
			const result = await notificationService.sendSinglePushNotification(singleNotificationRequestDto);

			expect(result.status).toBe('unsuccessful');
		});

		it('Test Subscribe To Notification Topic', async () => {
			const subscribeToTopicRequestDto: SubscribeToTopicRequestDto = {
				token: 'invalidToken',
				topic: 'Notifications-test-topic',
				userId,
			};
			const result = await notificationService.subscribeToNotificationTopic(subscribeToTopicRequestDto);

			expect(result.status).toBe('unsuccessful');
		});
	});
});
