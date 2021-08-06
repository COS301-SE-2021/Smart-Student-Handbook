import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

// API URL for the account endpoint on the backend
const NOTIFICATION_API = 'http://localhost:5001/';

// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class MessagingService {
	currentMessage = new BehaviorSubject(null);

	messaging;

	constructor(
		private angularFireMessaging: AngularFireMessaging,
		private httpClient: HttpClient
	) {
		firebase.initializeApp(environment.firebase);

		this.messaging = firebase.messaging();

		this.messaging
			.getToken({
				vapidKey:
					'BDK2FLOOnbVACZrKC1Riy2a9vYLIKUJDwPHbMHOxzV3ZtNqlNE1faNKSU190PEQ-ef8ZvB_5aDjtfGDNguvoyXo',
			})
			.then((currentToken) => {
				if (currentToken) {
					// Send the token to your server and update the UI if necessary
					// console.log(currentToken);
					this.messaging.onMessage = this.messaging.onMessage.bind(
						this.messaging
					);
					this.messaging.onTokenRefresh =
						this.messaging.onTokenRefresh.bind(this.messaging);

					this.subscribeToTopic(currentToken).subscribe(() => {
						// console.log(res);
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

		// this.angularFireMessaging.messaging.subscribe(
		//   (_messaging) => {
		//     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
		//     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
		//   }
		// )
	}

	requestPermission() {
		this.messaging.requestPermission();

		// this.angularFireMessaging.requestToken.subscribe(
		//   (token) => {
		//     console.log(token);
		//   },
		//   (err) => {
		//     console.error('Unable to get permission to notify.', err);
		//   }
		// );
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
		return this.httpClient.post(
			`${NOTIFICATION_API}notification/subscribeToTopic`,
			{
				token: currentToken,
				topic: 'general',
			},
			httpOptions
		);
	}
}
