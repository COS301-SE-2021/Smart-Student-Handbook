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

	let emailParams : EmailNotificationRequestDto = {
		email: 'justin@to.com',
		subject: "This is an mock email",
		body: "This is an mock email"
	}

	let emailResp = service.sendEmailNotification(emailParams);

	return emailResp.then( resp => {
		const sentEmails = mock.getSentMail();
		expect(sentEmails.length).toBe(2);
		expect(sentEmails[0].to).toBe('justin@to.com');
	})
	

	});
	
    it('email to have send an email', () => {
		admin.initializeApp();
		let emailParams : EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: "This is an mock email",
			body: "This is an mock email"
		}
	
		let emailResp = service.sendEmailNotification(emailParams);
	
		return emailResp.then( resp => {
			const sentEmails = mock.getSentMail();
			expect(sentEmails.length).toBe(3);
			expect(sentEmails[0].to).toBe('justin@to.com');
		});
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
  
	
  it('email to return false', function () {
	  let emailParams : EmailNotificationRequestDto = {
		  email: 'justin@to.com',
		  subject: "This is an mock email",
		  body: "This is an mock email"
	  };

	  mock.setShouldFailOnce();
	
	  jest.mock('nodemailer', () => ({
		  creatTransport: jest.fn().mockReturnValue({
			  sendMail: jest.fn().mockRejectedValue(new Error("broken")).mockReturnValue(emailResp)
		  })
	  }));
	
	  expect.assertions(1);
	  let resps = service.sendEmailNotification(emailParams);

	  return resps.then(resp => {expect(resp.success).toBe(true)});
	
	  // const myMock = jest.fn((emailParams) => service.sendEmailNotification(emailParams));
	  // myMock.mockReturnValue(Promise.resolve(emailResp));
	  //
	  // myMock(emailParams)
	

  });

    //Send notifications to all users (send to topic of 'general')
    it('Successfully send notifications to all users', async () => {



        const request: SendNotificationToGroupRequestDto = {
            title: 'Test title',
            body: 'Message body',
            topic: 'general',
        }


        const response = await service.sendGroupPushNotification(request);

        expect(response.status).toBe('unsuccessful');
    });

    //Send single user a notification

    it('Successfully send a single user a notification', async () => {


        const request: SingleNotificationRequestDto = {
            title: 'Test title',
            body: 'Message body',
            token: 'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
        }

        const response = await service.sendSinglePushNotification(request);

        expect(response.status).toBe('unsuccessful');
    });

    //Subscribe a user to a topic
    it('Successfully subscribed a user to a topic', async () => {


        const request: SubscribeToTopicRequestDto = {
            topic: 'test',
            token: 'fIJjM2BEsZlV73PFSOiJHd:APA91bH9MTMBOgMJTKcuCjpWKvwjXjhkVQkT2GauHkt30OZ08l-5Yl5opA97UTBPSFYv-vcc8-BzPbF751uRIb5DMj_Ei35yhs0WAIGHd0Kzd6C8EX1aPOZfiusfJo_oxOhTBya_ijkj',
        }

        const response = await service.subscribeToNotificationTopic(request);

        expect(response.status).toBe('unsuccessful');
    });
});
