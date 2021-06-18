import { Component } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import * as firebase from "firebase";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  panelOpenState = false;
  title = 'smart-student';
  message: any;

  constructor(private messagingService: MessagingService) { }
  ngOnInit() {
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;

    firebase.initializeApp(environment.firebase);
  }
}
