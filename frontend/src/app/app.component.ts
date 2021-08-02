import { Component, OnInit } from '@angular/core';
import { MessagingService, AccountService } from '@app/services';
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

	private isUserLoggedIn: boolean | undefined;

	constructor(
		private messagingService: MessagingService,
		private accountService: AccountService
	) {
		this.accountService.userLoggedInState.subscribe((state) => {
			this.isUserLoggedIn = state;
		});
	}

	ngOnInit() {
		// firebase.initializeApp(environment.firebase);

		this.messagingService.requestPermission();
		this.messagingService.receiveMessage();
		this.message = this.messagingService.currentMessage;
	}
}
