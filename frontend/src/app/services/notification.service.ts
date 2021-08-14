import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailInterface } from '../../../../functions/src/notification/interfaces/email.interface';
import { SingleNotificationRequestDto } from '../../../../functions/src/notification/dto/singleNotificationRequest.dto';
import { SendNotificationToGroupRequestDto } from '../../../../functions/src/notification/dto/sendNotificationToGroup.dto';
import { SubscribeToTopicRequestDto } from '../../../../functions/src/notification/dto/subscribeToTopicRequest.dto';
import { CreateNotificationDto } from '../../../../functions/src/notification/dto/createNotification.dto';

let addr;
if (window.location.host.includes('localhost')) {
	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/';
} else {
	addr = 'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/';
}

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const NOTIFICATION_API = addr;
@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	constructor(private httpClient: HttpClient) {}

	getUserNotifications(): Observable<any> {
		return this.httpClient.get(
			`${NOTIFICATION_API}notifications/getUserNotifications`,
			httpOptions
		);
	}

	getUnreadNotifications(): Observable<any> {
		return this.httpClient.get(
			`${NOTIFICATION_API}notifications/getUnreadNotifications`,
			httpOptions
		);
	}

	sendEmailNotification(email: EmailInterface): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/sendEmailNotifications`,
			{
				email,
			},
			httpOptions
		);
	}

	sendSinglePushNotification(
		singleNotificationRequest: SingleNotificationRequestDto
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/sendSinglePushNotification`,
			{
				singleNotificationRequest,
			},
			httpOptions
		);
	}

	sendGroupPushNotification(
		sendNotificationToGroupRequest: SendNotificationToGroupRequestDto
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/sendGroupPushNotifications`,
			{
				sendNotificationToGroupRequest,
			},
			httpOptions
		);
	}

	subscribeToNotificationTopic(
		subscribeToTopicRequest: SubscribeToTopicRequestDto
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/subscribeToNotificationTopic`,
			{
				subscribeToTopicRequest,
			},
			httpOptions
		);
	}

	createNotification(
		notificationDto: CreateNotificationDto
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/createNotification`,
			{
				notificationDto,
			},
			httpOptions
		);
	}

	sendCollaborationRequest(
		userSender: string,
		userReceiver: string
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/sendCollaborationRequest`,
			{
				userSender,
				userReceiver,
			},
			httpOptions
		);
	}

	sendUserToUserPushNotification(
		singleNotificationRequest: SingleNotificationRequestDto,
		receiverUserID: string
	): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/sendUserToUserPushNotification`,
			{
				singleNotificationRequest,
				receiverUserID,
			},
			httpOptions
		);
	}

	updateRead(notificationId: string): Observable<any> {
		return this.httpClient.post(
			`${NOTIFICATION_API}notifications/updateRead`,
			{
				notificationId,
			},
			httpOptions
		);
	}
}
