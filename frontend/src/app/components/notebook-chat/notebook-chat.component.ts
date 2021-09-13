import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { MessageDto } from '@app/models/message.dto';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-notebook-chat',
	templateUrl: './notebook-chat.component.html',
	styleUrls: ['./notebook-chat.component.scss'],
})
export class NotebookChatComponent implements OnInit {
	messages: MessageDto[] = [];

	showChat: boolean = true;

	tutorials: Observable<any[]>;

	constructor(private firestore: AngularFirestore) {}

	currentUser = {
		displayName: 'John',
		photoURL:
			'https://lh3.googleusercontent.com/a/AATXAJzU_URnF9rRW233xVX-kncorK4SgNGRh3iwZNH_=s96-c',
		uid: 'userId1',
	};

	ngOnInit(): void {
		/**
		 * Get the 25 most recent message from firebase and
		 * observe firebase in realtime, adding any new messages to the front of the messages array
		 */
		// this.firestore
		// 	.collection<any>('favorites', (ref) =>
		// 		ref.orderBy('createdAt', 'asc')
		// 	)
		// 	.valueChanges((change) => {
		//
		//   });
		// this.firestore
		// 	.collection('chats')
		// 	.doc('notebookId')
		// 	.collection('messages')
		// 	.get((querySnapshot: any) => {
		// 		querySnapshot.docChanges().forEach((change) => {
		// 			this.messages.push({
		// 				uid: change.doc.data().uid,
		// 				createAt: change.doc
		// 					.data()
		// 					.createdAt.toDate()
		// 					.toDateString(),
		// 				displayName: change.doc.data().displayName,
		// 				photoURL: change.doc.data().photoURL,
		// 				message: change.doc.data().message,
		// 			});
		// 		});
		// 	});

		this.tutorials = this.firestore
			.collection('chats/notebookId/messages')
			.valueChanges();

		this.tutorials.forEach((docs) => {
			docs.forEach((doc) => {
				this.messages.push({
					uid: doc.uid,
					createAt: doc.createdAt.toDate().toDateString(),
					displayName: doc.displayName,
					photoURL: doc.photoURL,
					message: doc.message,
				});
			});
		});
	}

	changeChat() {
		this.showChat = !this.showChat;
	}

	/**
	 * Send data to firebase once a user has sent a message
	 */
	async sendData(sentText: string): Promise<void> {
		const messagesRef = this.firestore
			.collection('chats')
			.doc('notebookId')
			.collection('messages');
		await messagesRef.add({
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			...this.currentUser,
			message: sentText,
		});
	}
}
