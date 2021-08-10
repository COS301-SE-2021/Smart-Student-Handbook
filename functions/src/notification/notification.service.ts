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
/**
 * Takes as input an email object from the Email interface it sets up the nodemailer with
 * the correct host , port and auth. Then it sets the correct mail options it then sends the mail with
 * the correct mailOptions
 * after which a success message will be returned if it was successful else it will return an error message
 * @param email
 * @return success
 */
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
				(
					info: SMTPTransport.SentMessageInfo,
				): EmailNotificationResponseDto => ({
					success: true,
					message: info.messageId,
				}),
			)
			.catch(() => ({
				success: false,
				message: 'Something went wrong!',
			}));
	}

	/**
	 * Takes a singleNotificationRequest object in and uses it to set the message with the appropriate
	 * data such as the token and the title as well as the body and date.
	 * Then it sends the message using firebase admin.messaging() function if successful it returns
	 * a successful status else an unsuccessful message with the error information is returned.
	 * @param singleNotificationRequest
	 * @returns status
	 * @return error
	 */
	async sendSinglePushNotification(
		singleNotificationRequest: SingleNotificationRequestDto,
	) {
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

		return admin
			.messaging()
			.send(message)
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

	/**
	 * Takes a sendNotificationToGroup object in and uses it to set the message with the appropriate
	 * data such as the token and the title as well as the body and date.
	 * Then it sends the message using firebase admin.messaging() function if successful it returns
	 * a successful status else an unsuccessful message with the error information is returned.
	 * @param sendNotificationToGroupRequest
	 * @returns status
	 */
	async sendGroupPushNotification(
		sendNotificationToGroupRequest: SendNotificationToGroupRequestDto,
	) {
		const message = {
			notification: {
				title: sendNotificationToGroupRequest.title,
				body: sendNotificationToGroupRequest.body,
			},
			topic: sendNotificationToGroupRequest.topic,
		};

		return admin
			.messaging()
			.send(message)
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

	/**
	 * Takes a subscribeToTopicRequest object in and uses it t0 send the message using firebase
	 * admin.messaging().subscribeToTopic() function if successful it returns
	 * a successful status else an unsuccessful message with the error information is returned.
	 * @param subscribeToTopicRequest
	 * @returns status
	 */
	async subscribeToNotificationTopic(
		subscribeToTopicRequest: SubscribeToTopicRequestDto,
	) {
		return admin
			.messaging()
			.subscribeToTopic(
				subscribeToTopicRequest.token,
				subscribeToTopicRequest.topic,
			)
			.then((response) => {
				console.log('Successfully subscribed:', response);

				if (response.successCount === 1) {
					return {
						status: 'successful',
					};
				}
				if (response.failureCount === 1) {
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
