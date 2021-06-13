import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { EmailNotificationRequestDto } from "./dto/emailNotificationRequest.dto"
import { EmailNotificationResponseDto } from "./dto/emailNotificationResponse.dto"

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
});
