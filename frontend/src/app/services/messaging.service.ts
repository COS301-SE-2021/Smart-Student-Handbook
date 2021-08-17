import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/services/account.service';

let addr;
if (window.location.host.includes('localhost')) {
	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/';
} else {
	addr = 'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/';
}

const MESSAGE_API = addr;

@Injectable()
export class MessagingService {
	currentMessage = new BehaviorSubject(null);

	messaging;

	constructor(
		private angularFireMessaging: AngularFireMessaging,
		private httpClient: HttpClient,
		private accountService: AccountService
	) {
		firebase.initializeApp(environment.firebase);

		this.messaging = firebase.messaging();
	}

	saveNotificationToken(userId: string) {
		this.messaging
			.getToken({
				vapidKey:
					'BLwI4ZLDPfp7e6LMr84u1ne7lwoO2v0NxrpM__JDztRSaHGcwjn7NhqpyNIsAH791DPyPTzjmdEU4Fv8CnvVUxY',
				// 'BDK2FLOOnbVACZrKC1Riy2a9vYLIKUJDwPHbMHOxzV3ZtNqlNE1faNKSU190PEQ-ef8ZvB_5aDjtfGDNguvoyXo',
			})
			.then((currentToken) => {
				if (currentToken) {
					// Send the token to your server and update the UI if necessary
					this.accountService
						.setUserNotificationToken(userId, currentToken)
						.subscribe(() => {
							this.messaging.onMessage =
								this.messaging.onMessage.bind(this.messaging);
							this.messaging.onTokenRefresh =
								this.messaging.onTokenRefresh.bind(
									this.messaging
								);

							this.subscribeToTopic(currentToken).subscribe(
								() => {
									// console.log(res);
								}
							);
						});
				} else {
					// Show permission request UI
					console.log(
						'No registration token available. Request permission to generate one.'
					);
				}
			})
			.catch((err) => {
				console.log('An error occurred while retrieving token. ', err);
			});
	}

	requestPermission() {
		this.messaging.requestPermission();
	}

	receiveMessage() {
		// this.messaging.onMessage = this.messaging.onMessage.bind(this.messaging);
		// this.messaging.onMessage((payload) => {
		//   console.log(payload);
		//   this.currentMessage.next(payload);
		// });
		// this.angularFireMessaging.messages.subscribe(
		//   (payload: any) => {
		//     console.log("new message received. ", payload);
		//     this.currentMessage.next(payload);
		//   })
	}

	subscribeToTopic(currentToken: string) {
		return this.httpClient.request<any>(
			'post',
			`${MESSAGE_API}/notification/subscribeToTopic`,
			{
				body: {
					token: currentToken,
					topic: 'general',
				},
			}
		);
	}
}
