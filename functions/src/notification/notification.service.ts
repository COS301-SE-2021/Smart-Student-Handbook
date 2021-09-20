import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import * as functions from 'firebase-functions';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { EmailInterface } from './interfaces/email.interface';
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto';
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto';
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto';
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto';
import { Notification } from './interfaces/notification.interface';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { Response } from '../notebook/interfaces/response.interface';

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
	/**
	 * Takes as input an email object from the Email interface it sets up the nodemailer with
	 * the correct host , port and auth. Then it sets the correct mail options it then sends the mail with
	 * the correct mailOptions
	 * after which a success message will be returned if it was successful else it will return an error message
	 * @param email
	 * @return success
	 */
	async sendEmailNotification(email: EmailInterface): Promise<EmailNotificationResponseDto> {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: functions.config().email.user,
				pass: functions.config().email.pass,
			},
		});

		const mailOptions = {
			from: functions.config().email.user,
			to: email.email,
			subject: email.subject,
			// eslint-disable-next-line max-len
			html: `${email.body}<hr><br><img src="https://storage.googleapis.com/smartstudentnotebook.appspot.com/FCMImages/Email_Logo_Header.png"/>`,
			attachments: [
				{
					filename: 'Email_Logo_Header.png',
					// eslint-disable-next-line max-len
					path: 'https://storage.googleapis.com/smartstudentnotebook.appspot.com/FCMImages/Email_Logo_Header.png',
					// eslint-disable-next-line max-len
					cid: 'https://storage.googleapis.com/smartstudentnotebook.appspot.com/FCMImages/Email_Logo_Header.png',
				},
			],
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

	/**
	 * Takes a singleNotificationRequest object in and uses it to set the message with the appropriate
	 * data such as the token and the title as well as the body and date.
	 * Then it sends the message using firebase admin.messaging() function if successful it returns
	 * a successful status else an unsuccessful message with the error information is returned.
	 * @param singleNotificationRequest
	 * @returns status
	 * @return error
	 */
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

		return admin
			.messaging()
			.send(message)
			.then(() => ({
				status: 'successful',
			}))
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
	async sendGroupPushNotification(sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {
		const message = {
			notification: {
				title: sendNotificationToGroupRequest.title,
				body: sendNotificationToGroupRequest.body,
			},
			topic: sendNotificationToGroupRequest.topic,
		};

		return (
			admin
				.messaging()
				.send(message)
				.then(() => ({
					status: 'successful',
				}))
				// eslint-disable-next-line @typescript-eslint/no-shadow
				.catch(() => ({
					status: 'unsuccessful',
				}))
		);
	}

	/**
	 * Takes a subscribeToTopicRequest object in and uses it t0 send the message using firebase
	 * admin.messaging().subscribeToTopic() function if successful it returns
	 * a successful status else an unsuccessful message with the error information is returned.
	 * @param subscribeToTopicRequest
	 * @returns status
	 */
	async subscribeToNotificationTopic(subscribeToTopicRequest: SubscribeToTopicRequestDto) {
		return (
			admin
				.messaging()
				.subscribeToTopic(subscribeToTopicRequest.token, subscribeToTopicRequest.topic)
				.then((response) => {
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
				// eslint-disable-next-line @typescript-eslint/no-shadow
				.catch(() => ({
					status: 'unsuccessful',
				}))
		);
	}

	// eslint-disable-next-line max-len
	async createNotification(createNotificationDto: CreateNotificationDto, userId): Promise<{ message: string } | void> {
		const notificationId: string = randomStringGenerator();

		if (createNotificationDto.notebookID) {
			return admin
				.firestore()
				.collection('notifications')
				.doc(notificationId)
				.set({
					userID: createNotificationDto.userID,
					type: createNotificationDto.type,
					body: createNotificationDto.body,
					heading: createNotificationDto.heading,
					notebookID: createNotificationDto.notebookID,
					notebookTitle: createNotificationDto.notebookTitle,
					creatorId: userId,
					opened: false,
					notificationId,
				})
				.then(() => ({
					message: 'Successfully created notification',
				}));
		}

		return await admin
			.firestore()
			.collection('notifications')
			.doc(notificationId)
			.set({
				userID: userId,
				type: createNotificationDto.type,
				body: createNotificationDto.body,
				heading: createNotificationDto.heading,
				notebookTitle: createNotificationDto.notebookTitle,
				opened: false,
				notificationId,
			})
			.then(() => ({
				message: 'Successfully created notification',
			}));
	}

	async getUserNotifications(userId: string): Promise<Notification[]> {
		const notifications = [];

		const notificationsSnapshot = await admin
			.firestore()
			.collection('notifications')
			.where('userID', '==', userId)
			.get();

		// const i = 0;
		// eslint-disable-next-line @typescript-eslint/no-shadow
		notificationsSnapshot.forEach((doc) => {
			if (doc.data().notebookID) {
				notifications.push({
					userID: userId,
					userNotificationID: doc.data().userNotificationID,
					type: doc.data().type,
					body: doc.data().body,
					heading: doc.data().heading,
					opened: doc.data().opened,
					notebookID: doc.data().notebookID,
					notebookTitle: doc.data().notebookTitle,
					notificationId: doc.data().notificationId,
					creatorId: doc.data().creatorId,
				});
			} else {
				notifications.push({
					userID: userId,
					userNotificationID: doc.data().userNotificationID,
					type: doc.data().type,
					body: doc.data().body,
					heading: doc.data().heading,
					opened: doc.data().opened,
					notebookTitle: doc.data().notebookTitle,
					notificationId: doc.data().notificationId,
					creatorId: doc.data().creatorId,
				});
			}
		});

		return notifications;
	}

	async getUnreadNotifications(userId: string): Promise<Notification[]> {
		const notificationIds: string[] = [];
		const notifications = [];

		const notificationsIdSnapshot = await admin.firestore().collection('notifications').get();
		notificationsIdSnapshot.forEach((doc) => {
			if (doc.get('userID') === userId) notificationIds.push(doc.get('userID'));
		});

		if (notificationIds.length === 0) {
			return notifications;
		}

		const unreadSnapshot = await admin
			.firestore()
			.collection('notifications')
			.where('opened', '==', false)
			.where('userID', 'in', notificationIds)
			.get();

		let i = 0;
		unreadSnapshot.forEach((doc) => {
			if (doc.data().notebookID) {
				notifications.push({
					userID: userId,
					userNotificationID: doc.data().userNotificationID,
					type: doc.data().type,
					body: doc.data().body,
					heading: doc.data().heading,
					opened: doc.data().opened,
					notebookID: doc.data().notebookID,
					notificationID: notifications[(i += 1)],
					notebookTitle: doc.data().notebookTitle,
					notificationId: doc.data().notificationId,
				});
			} else {
				notifications.push({
					userID: userId,
					userNotificationID: doc.data().userNotificationID,
					type: doc.data().type,
					body: doc.data().body,
					heading: doc.data().heading,
					opened: doc.data().opened,
					notificationID: notifications[(i += 1)],
					notebookTitle: doc.data().notebookTitle,
					notificationId: doc.data().notificationId,
				});
			}
		});

		return notifications;
	}

	async updateRead(notificationId: any): Promise<Response> {
		return admin
			.firestore()
			.collection('notifications')
			.doc(notificationId.notificationId)
			.update({
				opened: true,
			})
			.then(() => ({
				message: 'Successfully opened!',
				notificationId,
			}))
			.catch(() => {
				throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
			});
	}

	async getUserNotificationID(userId: string): Promise<string> {
		try {
			const user = await admin.firestore().collection('users').doc(userId).get();

			return user.data().notificationId;
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed.${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getUserEmail(userId: string): Promise<string> {
		return admin
			.auth()
			.getUser(userId)
			.then((userRecord) => userRecord.email);
	}

	async sendCollaborationRequest(
		userSender: string,
		userReceiver: string,
		notebookID: string,
		notebookTitle: string,
		userId: string,
	): Promise<{ success: boolean; message: string }> {
		const receiverEmail = await this.getUserEmail(userReceiver);
		const notificationID = await this.getUserNotificationID(userReceiver);

		const senderEmail = await this.getUserEmail(userSender);

		await this.sendEmailNotification({
			email: receiverEmail,
			subject: 'Collaboration request',
			// eslint-disable-next-line max-len
			body: `You have received a collaboration request from ${senderEmail} to collaborate on notebook ${notebookTitle}`,
		});

		await this.createNotification(
			{
				userID: userReceiver,
				body: `You have received a collaboration request from ${senderEmail} to 
						collaborate on notebook ${notebookTitle}`,
				heading: 'Collaboration Request',
				type: 'Request',
				notebookID,
				opened: false,
				notebookTitle,
			},
			userId,
		);

		if (notificationID) {
			await this.sendUserToUserPushNotification(
				{
					token: notificationID,
					title: 'Collaboration Request',
					body: `You have received a collaboration request 
						from ${senderEmail} to collaborate on notebook ${notebookTitle}`,
					userId: userSender,
				},
				userReceiver,
			);
		}

		return {
			success: true,
			message: 'Successfully sent collaboration request',
		};
	}

	async sendUserToUserPushNotification(
		singleNotificationRequest: SingleNotificationRequestDto,
		receiverUserID: string,
	) {
		const message = {
			token: singleNotificationRequest.token,
			notification: {
				title: singleNotificationRequest.title,
				body: singleNotificationRequest.body,
			},
			data: {
				uid: receiverUserID,
			},
		};

		return admin
			.messaging()
			.send(message)
			.then(() => ({
				status: 'successful',
			}))
			.catch((error) => ({
				status: 'unsuccessful',
				error: error.errorInfo,
			}));
	}
}
