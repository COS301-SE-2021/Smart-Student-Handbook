import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import firebase from "firebase";
import {environment} from "../../environments/environment";

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {

    firebase.initializeApp(environment.firebase);

    const messaging = firebase.messaging();

    messaging.getToken({vapidKey: "BDK2FLOOnbVACZrKC1Riy2a9vYLIKUJDwPHbMHOxzV3ZtNqlNE1faNKSU190PEQ-ef8ZvB_5aDjtfGDNguvoyXo"})
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          console.log(currentToken);
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
  }

  requestPermission() {
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
    // this.angularFireMessaging.messages.subscribe(
    //   (payload: any) => {
    //     console.log("new message received. ", payload);
    //     this.currentMessage.next(payload);
    //   })
  }
}
