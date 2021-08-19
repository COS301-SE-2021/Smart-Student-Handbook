import { Test, TestingModule } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { NotificationService } from './notification.service';
// import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
// import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
// import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
// import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires

// const { mock } = require('nodemailer');
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
		// const emailParams: EmailNotificationRequestDto = {
		// 	email: 'justin@to.com',
		// 	subject: 'This is an mock email',
		// 	body: 'This is an mock email',
		// };
		//
		// const emailResp = service.sendEmailNotification(emailParams);
		//
		// // eslint-disable-next-line @typescript-eslint/no-unused-vars
		// return emailResp.then((resp) => {
		// 	const sentEmails = mock.getSentMail();
		// 	expect(sentEmails.length).toBe(1);
		// 	expect(sentEmails[0].to).toBe('justin@to.com');
		// });
	});

	it('email to return true', () => {
		// const emailParams: EmailNotificationRequestDto = {
		// 	email: 'justin@to.com',
		// 	subject: 'This is an mock email',
		// 	body: 'This is an mock email',
		// };
		//
		// const emailResp = service.sendEmailNotification(emailParams);
		//
		// return emailResp.then((resp) => {
		// 	expect(resp.success).toBe(true);
		// });
	});

	it('email to return false', () => {
		// const emailParams: EmailNotificationRequestDto = {
		// 	email: 'justin@to.com',
		// 	subject: 'This is an mock email',
		// 	body: 'This is an mock email',
		// };
		//
		// mock.setShouldFailOnce();
		//
		// expect.assertions(1);
		// const resps = service.sendEmailNotification(emailParams);
		// return resps.then((resp) => {
		// 	expect(resp.success).toBe(false);
		// });
	});
	// Send notifications to all users (send to topic of 'general')
	it('Successfully send notifications to all users', async () => {
		// const request: SendNotificationToGroupRequestDto = {
		// 	title: 'Test title',
		// 	body: 'Message body',
		// 	topic: 'general',
		// 	userId: '',
		// };
		//
		// const response = await service.sendGroupPushNotification(request);
		//
		// expect(response.status).toBe('successful');
	});

	// Send single user a notification

	it('Successfully send a single user a notification', async () => {
		// const request: SingleNotificationRequestDto = {
		// 	title: 'Test title',
		// 	body: 'Message body',
		// 	token:
		// 		// eslint-disable-next-line max-len
		// eslint-disable-next-line max-len
		// 		'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
		// };
		//
		// const response = await service.sendSinglePushNotification(request);
		//
		// expect(response.status).toBe('unsuccessful');
	});

	it('Successfully send a single user a notification', async () => {
		// const request: SingleNotificationRequestDto = {
		// 	title: 'Test title',
		// 	body: 'Message body',
		// 	token:
		// 		// eslint-disable-next-line max-len
		// eslint-disable-next-line max-len
		// 		'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
		// };
		//
		// const response = await service.sendSinglePushNotification(request);
		//
		// expect(response.status).toBe('unsuccessful');
	});

	// Subscribe a user to a topic
	it('Successfully subscribed a user to a topic', async () => {
		// const request: SubscribeToTopicRequestDto = {
		// 	topic: 'test',
		// 	token:
		// 		// eslint-disable-next-line max-len
		// eslint-disable-next-line max-len
		// 		'fIJjM2BEsZlV73PFSOiJHd:APA91bH9MTMBOgMJTKcuCjpWKvwjXjhkVQkT2GauHkt30OZ08l-5Yl5opA97UTBPSFYv-vcc8-BzPbF751uRIb5DMj_Ei35yhs0WAIGHd0Kzd6C8EX1aPOZfiusfJo_oxOhTBya_ijkj',
		// };
		//
		// const response = await service.subscribeToNotificationTopic(request);
		//
		// expect(response.status).toBe('unsuccessful');
	});
});
