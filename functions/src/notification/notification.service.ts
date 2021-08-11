/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import { EmailInterface } from './interfaces/email.interface';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

@Injectable()
export class NotificationService {
	async sendEmailNotification(email: EmailInterface): Promise<EmailNotificationResponseDto> {
		// const transporter = nodemailer.createTransport({
		// 	host: 'smtp.gmail.com',
		// 	port: 465,
		// 	secure: true,
		// 	auth: {
		// 		type: 'OAuth2',
		// 		clientId: process.env.CLIENT_ID,
		// 		clientSecret: process.env.CLIENT_SECRET,
		// 	},
		// });
		// 	// 4/0AX4XfWhjOWiEfF-RNmn61Az6QEKg1bMETFeH2ve2-f8GjpPnmPmSkuUrVl3MFuNUKaIjkA
		// const mailOptions = {
		// 	from: process.env.EMAIL_USER,
		// 	to: email.email,
		// 	subject: email.subject,
		// 	text: email.body,
		// 	auth: {
		// 		user: process.env.EMAIL_USER,
		// 		refreshToken: process.env.REFRESH_TOKEN,
		// 		accessToken: process.env.ACCESS_TOKEN,
		// 		expires: 1484314697598,
		// 	},
		// };
		//
		// return transporter
		// 	.sendMail(mailOptions)
		// 	.then(
		// 		(info: SMTPTransport.SentMessageInfo): EmailNotificationResponseDto => ({
		// 			success: true,
		// 			message: info.messageId,
		// 		}),
		// 	)
		// 	.catch(() => ({
		// 		success: false,
		// 		message: 'Something went wrong!',
		// 	}));

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email.email,
			subject: email.subject,
			text: email.body,
		};

		return transporter
			.sendMail(mailOptions)
			.then(
				(info: SMTPTransport.SentMessageInfo): EmailNotificationResponseDto => ({
					success: true,
					message: info.messageId,
				}),
			)
			.catch(() => ({
				success: false,
				message: 'Something went wrong!',
			}));
	}

	async sendSinglePushNotification(singleNotificationRequest: SingleNotificationRequestDto) {
		// Send notification to single user
		const message = {

			token: singleNotificationRequest.token,
			notification: {
				title: singleNotificationRequest.title,
				body: singleNotificationRequest.body,
			},
			data: {
				test: 'test data',
			},
		};

		return admin.messaging().send(message)
			.then((response) => {
				console.log('Successfully sent individual message:', response);

				return {
					status: 'successful',
				};
			})
			.catch((error) => {
				console.log('Error sending individual message:', error);

				return {
					status: 'unsuccessful',
					error: error.errorInfo,
				};
			});
	}

	async sendGroupPushNotification(sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {
		const message = {
			notification: {
				title: sendNotificationToGroupRequest.title,
				body: sendNotificationToGroupRequest.body,
			},
			topic: sendNotificationToGroupRequest.topic,
		};

		return admin.messaging().send(message)
			.then((response) => {
				console.log('Successfully sent notification to group:', response);

				return {
					status: 'successful',
				};
			})
			.catch((error) => {
				console.log('Error sending notification to group:', error);

				return {
					status: 'unsuccessful',
				};
			});
	}

	async subscribeToNotificationTopic(subscribeToTopicRequest: SubscribeToTopicRequestDto) {
		return admin.messaging().subscribeToTopic(subscribeToTopicRequest.token, subscribeToTopicRequest.topic)
			.then((response) => {
				console.log('Successfully subscribed:', response);

				if (response.successCount === 1) {
					return {
						status: 'successful',
					};
				} if (response.failureCount === 1) {
					return {
						status: 'unsuccessful',
						error: response.errors,
					};
				}
				return {
					status: 'unsuccessful',
				};
			})
			.catch((error) => {
				console.log('Error sending message:', error);

				return {
					status: 'unsuccessful',
				};
			});
	}
}
