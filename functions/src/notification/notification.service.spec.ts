import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { EmailNotificationRequestDto } from "./dto/emailNotificationRequest.dto"
import { EmailNotificationResponseDto } from "./dto/emailNotificationResponse.dto"
import transport from "nodemailer/lib/smtp-transport";



const { mock } = require('nodemailer');
const nodemailer = require('nodemailer')
const SMTPTransport = require("nodemailer/lib/smtp-transport")
const SendmailTransport = require("nodemailer/lib/sendmail-transport")

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
			expect(sentEmails.length).toBe(1);
			expect(sentEmails[0].to).toBe('justin@to.com');
		});
    });
    

  
    it('email to return true', async () => {
		
		let emailParams : EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: "This is an mock email",
			body: "This is an mock email"
		}
		
		
		let emailResp = service.sendEmailNotification(emailParams);
		
		expect.assertions(1);
		return emailResp.then(resp => {expect(resp.success).toBe(true)});
	});
	
	it('email to return false', function () {
		let emailParams : EmailNotificationRequestDto = {
			email: 'justin@to.com',
			subject: "This is an mock email",
			body: "This is an mock email"
		};
		
		let emailResp : EmailNotificationResponseDto = {
			success: false,
			message: "Something went wrong!"
		};
		
		jest.mock('nodemailer', () => ({
			creatTransport: jest.fn().mockReturnValue({
				sendMail: jest.fn().mockRejectedValue(new Error("broken"))
			})
		}));
		
		expect.assertions(1);
		let resps = service.sendEmailNotification(emailParams);
		return resps.then(resp => {expect(resp.success).toBe(false)});
		
		// const myMock = jest.fn((emailParams) => service.sendEmailNotification(emailParams));
		// myMock.mockReturnValue(Promise.resolve(emailResp));
		//
		// myMock(emailParams)
		
	});
});
