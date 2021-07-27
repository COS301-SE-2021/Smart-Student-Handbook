import { Component } from '@angular/core'
import firebase from 'firebase'
import { MessagingService } from './services/messaging.service'
// import * as firebase from "firebase/database";
import { environment } from '../environments/environment'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	panelOpenState = false

	title = 'smart-student'

	message: any

	constructor(private messagingService: MessagingService) {}

	ngOnInit() {
		// firebase.initializeApp(environment.firebase);

		this.messagingService.requestPermission()
		this.messagingService.receiveMessage()
		this.message = this.messagingService.currentMessage
	}
}
