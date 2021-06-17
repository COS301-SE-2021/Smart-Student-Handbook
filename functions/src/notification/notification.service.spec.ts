import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { EmailNotificationRequestDto } from './dto/emailNotificationRequest.dto';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import {SendNotificationToGroupRequestDto} from "./dto/sendNotificationToGroup.dto";
import {initializeApp} from "firebase-admin/lib/firebase-namespace-api";
import * as admin from 'firebase-admin';
import {createNestServer} from "../main";
import {SingleNotificationRequestDto} from "./dto/singleNotificationRequest.dto";
import {SubscribeToTopicRequestDto} from "./dto/subscribeToTopicRequest.dto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
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

  it('email to return true', () => {
    
    let emailParams : EmailNotificationRequestDto = {
		email: 'justin@to.com',
		subject: "This is an mock email",
		body: "This is an mock email"
    }
    
    let emailResp = service.sendEmailNotification(emailParams);
    
    return emailResp.then(resp => {expect(resp.success).toBe(true)});
  });
  
  it('email to have send an email', () => {

	let emailParams : EmailNotificationRequestDto = {
		email: 'justin@to.com',
		subject: "This is an mock email",
		body: "This is an mock email"
	}

	let emailResp = service.sendEmailNotification(emailParams);

	return emailResp.then( resp => {
		const sentEmails = mock.getSentMail();
		expect(sentEmails.length).toBe(1);
		expect(sentEmails[0].to).toBe('justin@to.com');
	});
  });

    //Send notifications to all users (send to topic of 'general')
    it('Successfully send notifications to all users', async () => {

        admin.initializeApp();

        const request: SendNotificationToGroupRequestDto = {
            title: 'Test title',
            body: 'Message body',
            topic: 'general',
        }


        const response = await service.sendGroupPushNotification(request);

        expect(response.status).toBe('successful');
    });

    //Send single user a notification
    it('Successfully send a single user a notification', async () => {


        const request: SingleNotificationRequestDto = {
            title: 'Test title',
            body: 'Message body',
            token: 'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
        }

        const response = await service.sendSinglePushNotification(request);

        expect(response.status).toBe('successful');
    });

    //Subscribe a user to a topic
    it('Successfully subscribed a user to a topic', async () => {


        const request: SubscribeToTopicRequestDto = {
            topic: 'test',
            token: 'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
        }

        const response = await service.subscribeToNotificationTopic(request);

        expect(response.status).toBe('successful');
    })
});
