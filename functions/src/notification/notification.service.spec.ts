import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { exposeMockFirebaseAdminApp } from 'mock-firebase-ts';
import { NotificationService } from './notification.service';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';

const { mock } = require('nodemailer');

admin.initializeApp();
// const mocked = exposeMockFirebaseAdminApp(app);

describe('NotificationService', () => {
	let service: NotificationService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NotificationService],
		}).compile();

		service = module.get<NotificationService>(NotificationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('email to have send an email', () => {
		const emailParams: EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: 'This is an mock email',
			body: 'This is an mock email',
		};

		const emailResp = service.sendEmailNotification(emailParams);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return emailResp.then((resp) => {
			const sentEmails = mock.getSentMail();
			expect(sentEmails.length).toBe(1);
			expect(sentEmails[0].to).toBe('justin@to.com');
		});
	});

	it('email to return true', () => {
		const emailParams: EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: 'This is an mock email',
			body: 'This is an mock email',
		};

		const emailResp = service.sendEmailNotification(emailParams);

		return emailResp.then((resp) => {
			expect(resp.success).toBe(true);
		});
	});

	it('email to return false', () => {
		const emailParams: EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: 'This is an mock email',
			body: 'This is an mock email',
		};

		mock.setShouldFailOnce();

		expect.assertions(1);
		const resps = service.sendEmailNotification(emailParams);
		return resps.then((resp) => {
			expect(resp.success).toBe(false);
		});
	});
	// Send notifications to all users (send to topic of 'general')
	it('Successfully send notifications to all users', async () => {
		const request: SendNotificationToGroupRequestDto = {
			title: 'Test title',
			body: 'Message body',
			topic: 'general',
			userId: '',
		};

		const response = await service.sendGroupPushNotification(request);

		expect(response.status).toBe('successful');
	});

	// Send single user a notification

	it('Successfully send a single user a notification', async () => {
		const request: SingleNotificationRequestDto = {
			title: 'Test title',
			body: 'Message body',
			token:
				// eslint-disable-next-line max-len
				'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
		};

		// const response = await service.sendSinglePushNotification(request);

		// expect(response.status).toBe('unsuccessful');
	});

	it('Successfully send a single user a notification', async () => {
		const request: SingleNotificationRequestDto = {
			title: 'Test title',
			body: 'Message body',
			token:
				// eslint-disable-next-line max-len
				'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
		};

		// const response = await service.sendSinglePushNotification(request);

		// expect(response.status).toBe('unsuccessful');
	});

	// Subscribe a user to a topic
	it('Successfully subscribed a user to a topic', async () => {
		const request: SubscribeToTopicRequestDto = {
			topic: 'test',
			token:
				// eslint-disable-next-line max-len
				'fIJjM2BEsZlV73PFSOiJHd:APA91bH9MTMBOgMJTKcuCjpWKvwjXjhkVQkT2GauHkt30OZ08l-5Yl5opA97UTBPSFYv-vcc8-BzPbF751uRIb5DMj_Ei35yhs0WAIGHd0Kzd6C8EX1aPOZfiusfJo_oxOhTBya_ijkj',
		};

		// const response = await service.subscribeToNotificationTopic(request);

		// expect(response.status).toBe('unsuccessful');
	});

	it('sendEmailNotification', async () => {
		const email = {
			email: 'louw707@gmail.com',
			subject: 'Test subject',
			body: 'Test body',
		};

		await service.sendEmailNotification(email);
	});

	it('sendSinglePushNotification', async () => {
		const pushNotification = {
			token: 'RandomToken',
			title: 'RandomTitle',
			body: 'RandomBody',
			userId: 'UserId',
		};

		// await service.sendSinglePushNotification(pushNotification);
	});

	it('sendGroupPushNotification', async () => {
		const pushNotification = {
			topic: 'RandomTopic',
			title: 'RandomTitle',
			body: 'RandomBody',
			userId: 'UserId',
		};

		// await service.sendGroupPushNotification(pushNotification);
	});

	it('subscribeToNotificationTopic', async () => {
		const pushNotification = {
			token: 'RandomToken',
			topic: 'RandomTopic',
			userId: 'UserId',
		};

		// await service.subscribeToNotificationTopic(pushNotification);
	});

	it('createNotificationo a topic', async () => {
		const pushNotification = {
			userID: 'userID',
			type: 'type',
			heading: 'heading',
			body: 'body',
			opened: false,
			notebookID: 'notebookId',
			notebookTitle: 'notebookTitle',
		};

		await service.createNotification(pushNotification, 'userID');
	});

	it('getUserNotifications', async () => {
		await service.getUserNotifications('userId');
	});

	it('getUnreadNotifications', async () => {
		await service.getUnreadNotifications('userId');
	});
});
