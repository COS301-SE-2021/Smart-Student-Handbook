import { Injectable } from '@nestjs/common';
import { EmailInterface } from "./interfaces/email.interface";
import { EmailNotificationResponseDto} from "./dto/emailNotificationResponse.dto";

import SMTPTransport = require("nodemailer/lib/smtp-transport");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class NotificationService {

	async sendEmailNotification(email: EmailInterface): Promise<EmailNotificationResponseDto> {

		let transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			},
			authMethod: "PLAIN"

			// secure: true,

		});

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: email.email,
			subject: email.subject,
			text: email.body
		};

		return transporter.sendMail(mailOptions)
			.then((info: SMTPTransport.SentMessageInfo): EmailNotificationResponseDto => {
				return {
					success: true,
					message: info.messageId
				};
			})
			.catch(Err => {
				return {
					success: false,
					message: "Something went wrong!"
				};
			});

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
}
