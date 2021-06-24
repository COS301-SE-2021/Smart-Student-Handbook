/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { EmailInterface } from './interfaces/email.interface'
import { EmailNotificationResponseDto } from './dto/emailNotificationResponse.dto'
import { SingleNotificationRequestDto } from './dto/singleNotificationRequest.dto'
import { SubscribeToTopicRequestDto } from './dto/subscribeToTopicRequest.dto'
import { SendNotificationToGroupRequestDto } from './dto/sendNotificationToGroup.dto'
import * as admin from 'firebase-admin'

import SMTPTransport = require('nodemailer/lib/smtp-transport')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

@Injectable()
export class NotificationService {
	async sendEmailNotification(
		email: EmailInterface
	): Promise<EmailNotificationResponseDto> {
		let transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
			authMethod: 'PLAIN',

			// secure: true,
		})

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: email.email,
			subject: email.subject,
			text: email.body,
		}

		return transporter
			.sendMail(mailOptions)
			.then(
				(
					info: SMTPTransport.SentMessageInfo
				): EmailNotificationResponseDto => {
					return {
						success: true,
						message: info.messageId,
					}
				}
			)
			.catch((Err) => {
				return {
					success: false,
					message: 'Something went wrong!',
				}
			})
	}

	async sendSinglePushNotification(
		singleNotificationRequest: SingleNotificationRequestDto
	) {
		//Send notification to single user
		const message = {
			token: singleNotificationRequest.token,
			notification: {
				title: singleNotificationRequest.title,
				body: singleNotificationRequest.body,
			},
			data: {
				test: 'test data',
			},
		}

		return admin
			.messaging()
			.send(message)
			.then((response) => {
				console.log('Successfully sent individual message:', response)

				return {
					status: 'successful',
				}
			})
			.catch((error) => {
				console.log('Error sending individual message:', error)

				return {
					status: 'unsuccessful',
					error: error.errorInfo,
				}
			})
	}

	async sendGroupPushNotification(
		sendNotificationToGroupRequest: SendNotificationToGroupRequestDto
	) {
		const message = {
			notification: {
				title: sendNotificationToGroupRequest.title,
				body: sendNotificationToGroupRequest.body,
			},
			topic: sendNotificationToGroupRequest.topic,
		}

		return admin
			.messaging()
			.send(message)
			.then((response) => {
				console.log(
					'Successfully sent notification to group:',
					response
				)

				return {
					status: 'successful',
				}
			})
			.catch((error) => {
				console.log('Error sending notification to group:', error)

				return {
					status: 'unsuccessful',
				}
			})
	}

	async subscribeToNotificationTopic(
		subscribeToTopicRequest: SubscribeToTopicRequestDto
	) {
		return admin
			.messaging()
			.subscribeToTopic(
				subscribeToTopicRequest.token,
				subscribeToTopicRequest.topic
			)
			.then((response) => {
				console.log('Successfully subscribed:', response)

				if (response.successCount == 1) {
					return {
						status: 'successful',
					}
				} else if (response.failureCount == 1) {
					return {
						status: 'unsuccessful',
						error: response.errors,
					}
				}
			})
			.catch((error) => {
				console.log('Error sending message:', error)

				return {
					status: 'unsuccessful',
				}
			})
	}
}
