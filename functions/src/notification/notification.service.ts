import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import * as functions from 'firebase-functions';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import firebase from 'firebase';
import { error } from 'firebase-functions/lib/logger';
import { async } from 'rxjs';
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
	async sendGroupPushNotification(sendNotificationToGroupRequest: SendNotificationToGroupRequestDto) {
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
	async subscribeToNotificationTopic(subscribeToTopicRequest: SubscribeToTopicRequestDto) {
		return admin
			.messaging()
			.subscribeToTopic(subscribeToTopicRequest.token, subscribeToTopicRequest.topic)
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

	async createNotification(createNotificationDto: CreateNotificationDto): Promise<{ message: string } | void> {
		const notificationId: string = randomStringGenerator();

		try {
			if (createNotificationDto.notebookID) {
				return await admin
					.firestore()
					.collection('notifications')
					.doc(notificationId)
					.set({
						userID: createNotificationDto.userID,
						type: createNotificationDto.type,
						body: createNotificationDto.body,
						heading: createNotificationDto.heading,
						notebookID: createNotificationDto.notebookID,
						opened: false,
					})
					.then(() => ({
						message: 'Successfully created notification',
					}))
					.catch(() => {
						throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
					});
			}

			return await admin
				.firestore()
				.collection('notifications')
				.doc(notificationId)
				.set({
					userID: createNotificationDto.userID,
					type: createNotificationDto.type,
					body: createNotificationDto.body,
					heading: createNotificationDto.heading,
					opened: false,
				})
				.then(() => ({
					message: 'Successfully created notification',
				}))
				.catch(() => {
					throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
				});
		} catch (error) {
			throw new HttpException(
				'Something went wrong. Operation could not be executed.',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getUserId(): Promise<string> {
		try {
			return firebase.auth().currentUser.uid;
		} catch (error) {
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}
	}

	async getUserNotifications(): Promise<Notification[]> {
		const userID: string = await this.getUserId();
		const notificationIds: string[] = [];
		const notifications = [];

		try {
			const notificationsIdSnapshot = await admin.firestore().collection('notifications').get();
			// eslint-disable-next-line @typescript-eslint/no-shadow
			notificationsIdSnapshot.forEach((doc) => {
				if (doc.get('userID') === userID) notificationIds.push(doc.get('userID'));
			});

			if (notificationIds.length === 0) {
				return notifications;
			}

			const notificationsSnapshot = await admin
				.firestore()
				.collection('notifications')
				.where('userID', 'in', notificationIds)
				.get();

			const i = 0;
			// eslint-disable-next-line @typescript-eslint/no-shadow
			notificationsSnapshot.forEach((doc) => {
				if (doc.data().notebookID) {
					notifications.push({
						userID: doc.data().userID,
						userNotificationID: doc.data().userNotificationID,
						type: doc.data().type,
						body: doc.data().body,
						heading: doc.data().heading,
						opened: doc.data().opened,
						notebookID: doc.data().notebookID,
					});
				} else {
					notifications.push({
						userID: doc.data().userID,
						userNotificationID: doc.data().userNotificationID,
						type: doc.data().type,
						body: doc.data().body,
						heading: doc.data().heading,
						opened: doc.data().opened,
					});
				}
			});

			return notifications;
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async getUnreadNotifications(): Promise<Notification[]> {
		const userID: string = await this.getUserId();
		const notificationIds: string[] = [];
		const notifications = [];
		try {
			const notificationsIdSnapshot = await admin.firestore().collection('notifications').get();
			// eslint-disable-next-line @typescript-eslint/no-shadow
			notificationsIdSnapshot.forEach((doc) => {
				if (doc.get('userID') === userID) notificationIds.push(doc.get('userID'));
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
			// eslint-disable-next-line @typescript-eslint/no-shadow
			unreadSnapshot.forEach((doc) => {
				if (doc.data().notebookID) {
					notifications.push({
						userID: doc.data().userID,
						userNotificationID: doc.data().userNotificationID,
						type: doc.data().type,
						body: doc.data().body,
						heading: doc.data().heading,
						opened: doc.data().opened,
						notebookID: doc.data().notebookID,
						notificationID: notifications[(i += 1)],
					});
				} else {
					notifications.push({
						userID: doc.data().userID,
						userNotificationID: doc.data().userNotificationID,
						type: doc.data().type,
						body: doc.data().body,
						heading: doc.data().heading,
						opened: doc.data().opened,
						notificationID: notifications[(i += 1)],
					});
				}
			});

			return notifications;
		} catch (e) {
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		}
	}

	async updateRead(notificationId: string): Promise<Response> {
		try {
			return await admin
				.firestore()
				.collection('notifications')
				.doc(notificationId)
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
		} catch (error) {
			throw new HttpException(
				`Something went wrong. Operation could not be executed.${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
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
			.then((userRecord) => userRecord.email)
			.catch((error: any) => {
				throw new HttpException(
					`Something went wrong. Operation could not be executed.${error}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			});
	}

	async sendCollaborationRequest(
		userSender: string,
		userReceiver: string,
		notebookID: string,
	): Promise<{ success: boolean; message: string }> {
		const receiverEmail = await this.getUserEmail(userReceiver);
		const notificationID = await this.getUserNotificationID(userReceiver);

		const senderEmail = await this.getUserEmail(userSender);

		await this.sendEmailNotification({
			email: receiverEmail,
			subject: 'Collaboration request',
			// eslint-disable-next-line max-len
			body: `You have received a collaboration request from ${senderEmail}`,
		});

		await this.createNotification({
			userID: userReceiver,
			body: `You have received a collaboration request from ${senderEmail}`,
			heading: 'Collaboration Request',
			type: 'Request',
			notebookID,
			opened: false,
		});

		await this.sendUserToUserPushNotification(
			{
				token: notificationID,
				title: 'Collaboration Request',
				body: `You have received a collaboration request from ${senderEmail}`,
			},
			userReceiver,
		);

		return {
			success: true,
			message: 'Successfully sent collaboration request',
		};

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
	}

	async sendUserToUserPushNotification(
		singleNotificationRequest: SingleNotificationRequestDto,
		receiverUserID: string,
	) {
		// Send notification to single user
		// const receiverToken = await this.getUserNotificationID(receiverUserID);
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
}
