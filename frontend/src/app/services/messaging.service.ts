import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/services/account.service';
import 'firebase/performance';

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
		firebase.performance();
		// if (firebase.messaging.isSupported())
		this.messaging = firebase.messaging();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	saveNotificationToken(userId: string) {
		this.messaging.requestPermission();

		this.messaging
			.getToken({
				vapidKey:
					'BDqG2M93TwCaD8030pgjTRR_7pXu_1RN0BbLd2Hs4H6NU8FfXEQ0QxQpg8nPOPpw4Zy8OrNXuIHyZu-FtNPmO90',
			})
			.then((currentToken) => {
				if (currentToken) {
					// Send the token to your server and update the UI if necessary
					this.accountService
						// .setUserNotificationToken(userId, currentToken)
						.setUserNotificationToken(currentToken)
						.subscribe(() => {
							this.messaging.onMessage =
								this.messaging.onMessage.bind(this.messaging);
							this.messaging.onTokenRefresh =
								this.messaging.onTokenRefresh.bind(
									this.messaging
								);

							this.subscribeToTopic(currentToken).subscribe(
								() => {
									// console.log(currentToken);
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
