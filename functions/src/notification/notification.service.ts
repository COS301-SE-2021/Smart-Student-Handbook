/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EmailInterface } from './interfaces/email.interface';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';

import * as admin from 'firebase-admin';

import SMTPTransport = require('nodemailer/lib/smtp-transport');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class NotificationService {
  async sendEmailNotification(
    email: EmailInterface,
  ): Promise<EmailNotificationResponseDto> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      authMethod: 'PLAIN',

      // secure: true,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email.email,
      subject: email.subject,
      text: email.body,
    };

    return transporter
      .sendMail(mailOptions)
      .then(
        (info: SMTPTransport.SentMessageInfo): EmailNotificationResponseDto => {
          return {
            success: true,
            message: info.messageId,
          };
        },
      );

    // return transporter.sendMail(mailOptions, (err: Error | null, info: SMTPTransport.SentMessageInfo): EmailNotificationResponseDto => {
    // 	if (err != null) {
    // 		return {
    // 			success: false,
    // 			message: err.name + ": " + err.message
    // 		};
    //
    // 	}
    // 	console.log(info.messageId);
    // 	return {
    // 		success: true,
    // 		message: info.messageId
    // 	};
    //
    // });
  }

  async sendSinglePushNotification() {

    //Send notification to single user
    const message = {
		
      token: 'fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre',
      notification:{
        title: 'Test title',
        body: 'Notification body'
      },
      data : {
       test: 'test data'
      }        
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  async sendGroupPushNotification() {

    const message = {
      notification: {
        title:"A test title",
        body:"Some content"
      },
      topic: "general"
    };

    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  }

  async subscribeToNotificationTopic(){

    admin.messaging().subscribeToTopic('fIJjM2BEsZlV73PFSOiJHd:APA91bEoPMzIwnIQqHZOMAomnhfmE8vrZeTDelPGkRhA3iIJieG0kXIbUMDkfqn9tOa4U-P5uhdqxDjUtfP1C3cNntkAIQqZxRfe8YQ41_J44BDS8Fxf2Xyn9wyAbgKWNad4ECKNcvre', 'general')
    .then((response) => {

      // See the MessagingTopicManagementResponse reference documentation for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });
  }
}
