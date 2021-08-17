import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires

admin.initializeApp();
const { mock } = require('nodemailer');

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

		expect(response.status).toBe('unsuccessful');
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

		const response = await service.sendSinglePushNotification(request);

		expect(response.status).toBe('successful');
	});

	it('Successfully send a single user a notification', async () => {
		const request: SingleNotificationRequestDto = {
			title: 'Test title',
			body: 'Message body',
			token:
				// eslint-disable-next-line max-len
				'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
		};

		const response = await service.sendSinglePushNotification(request);

		expect(response.status).toBe('unsuccessful');
	});

	// Subscribe a user to a topic
	it('Successfully subscribed a user to a topic', async () => {
		const request: SubscribeToTopicRequestDto = {
			topic: 'test',
			token:
				// eslint-disable-next-line max-len
				'fIJjM2BEsZlV73PFSOiJHd:APA91bH9MTMBOgMJTKcuCjpWKvwjXjhkVQkT2GauHkt30OZ08l-5Yl5opA97UTBPSFYv-vcc8-BzPbF751uRIb5DMj_Ei35yhs0WAIGHd0Kzd6C8EX1aPOZfiusfJo_oxOhTBya_ijkj',
		};

		const response = await service.subscribeToNotificationTopic(request);

		expect(response.status).toBe('unsuccessful');
	});
});
