import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';
// import { EmailInterface } from './interfaces/email.interface';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { EmailInterface } from './interfaces/email.interface';
import { CreateNotificationDto } from './dto/createNotification.dto';

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

describe('Notifications Service Integration Tests', () => {
	let notificationService: NotificationService;
	let notificationCount = 0;
	let notificationUnreadCount = 0;
	let notificationId = '';
	const userId = '0l97C952khXb8eYEYui9NpbKa0t2';

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

		it('Create Notification Success', async () => {
			const createNotificationDto: CreateNotificationDto = {
				userID: userId,
				type: 'Notification Test Type',
				heading: 'Notification Test Heading',
				body: 'Notification Test Body',
				opened: false,
				notebookID: 'Notification Test ID',
				notebookTitle: 'Notification Test Title',
			};
			const result = await notificationService.createNotification(createNotificationDto, userId);

			expect(result).toStrictEqual({ message: 'Successfully created notification' });
		});

		it('Get NotificationCount', async () => {
			notificationCount = (await notificationService.getUserNotifications(userId)).length;
			notificationUnreadCount = (await notificationService.getUnreadNotifications(userId)).length;
		});

		it('Create Notification Success 1', async () => {
			const createNotificationDto: CreateNotificationDto = {
				userID: userId,
				type: 'Notification Test Type',
				heading: 'Notification Test Heading',
				body: 'Notification Test Body',
				opened: false,
				notebookTitle: 'Notification Test Title',
			};
			const result = await notificationService.createNotification(createNotificationDto, userId);

			expect(result).toStrictEqual({ message: 'Successfully created notification' });
		});

		it('Create Notification Success 2', async () => {
			const createNotificationDto: CreateNotificationDto = {
				userID: userId,
				type: 'Notification Test Type',
				heading: 'Notification Test Heading',
				body: 'Notification Test Body',
				opened: false,
				notebookTitle: 'Notification Test Title',
			};
			const result = await notificationService.createNotification(createNotificationDto, userId);

			expect(result).toStrictEqual({ message: 'Successfully created notification' });
		});

		it('Check if notifications cab be retrieved', async () => {
			const result = await notificationService.getUserNotifications(userId);
			notificationId = result[0].notificationId;

			expect(result.length).toBe(notificationCount + 2);
		});

		it('Check if unread notifications can be retrieved', async () => {
			const result = await notificationService.getUnreadNotifications(userId);

			expect(result.length).toBe(notificationUnreadCount + 2);
		});

		it('Updated Read status', async () => {
			const result = await notificationService.updateRead({ notificationId });

			expect(result.message).toBe('Successfully opened!');
		});

		it('Throw Exception: InvalidNotificationId', async () => {
			let error: HttpException;

			try {
				await notificationService.updateRead({ notificationId: 'InvalidNotificationId' });
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('Not Found');
		});

		it('Throw Exception:  UserId', async () => {
			let error: HttpException;

			try {
				await notificationService.getUserEmail('Not Registered');
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe('There is no user record corresponding to the provided identifier.');
		});

		it('Test Get User Email', async () => {
			const result = await notificationService.getUserEmail(userId);

			expect(result).toBe('test-user-access@smartstudenthandbook.co.za');
		});

		it('Test Send Collaboration Request', async () => {
			const result = await notificationService.sendCollaborationRequest(
				userId,
				userId,
				notificationId,
				'Notebook Test Title',
				userId,
			);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Successfully sent collaboration request');
		});

		it('Test Send Collaboration Request', async () => {
			const singleNotificationRequestDto: SingleNotificationRequestDto = {
				token: 'testToken',
				title: 'test title',
				body: 'test body',
				userId,
			};
			// eslint-disable-next-line max-len
			const result = await notificationService.sendUserToUserPushNotification(singleNotificationRequestDto, userId);

			expect(result.status).toBe('unsuccessful');
		});
	});
});
