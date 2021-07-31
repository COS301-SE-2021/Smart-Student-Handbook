import { Component, OnInit } from '@angular/core';
import { MessagingService } from '@app/services';
// import * as firebase from "firebase/database";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	panelOpenState = false;

	title = 'smart-student';

	message: any;

	constructor(private messagingService: MessagingService) {}

	ngOnInit() {
		// firebase.initializeApp(environment.firebase);

		this.messagingService.requestPermission();
		this.messagingService.receiveMessage();
		this.message = this.messagingService.currentMessage;
	}
}
