import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { MessageDto } from '@app/models/message.dto';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AccountService, NotebookObservablesService } from '@app/services';

@Component({
	selector: 'app-notebook-chat',
	templateUrl: './notebook-chat.component.html',
	styleUrls: ['./notebook-chat.component.scss'],
})
export class NotebookChatComponent implements OnInit {
	user: any;

	notebookId: string = 'none';

	messages: MessageDto[] = [];

	showChat: boolean = true;

	constructor(
		private firestore: AngularFirestore,
		private accountService: AccountService,
		private notebookObservables: NotebookObservablesService
	) {}

	currentUser = {
		displayName: '',
		photoURL: '',
		uid: '',
	};

	ngOnInit(): void {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
				this.currentUser = {
					displayName: user.displayName,
					photoURL: user.profilePic,
					uid: user.uid,
				};
			}
		});

		this.notebookObservables.loadEditor.subscribe(async (noteInfo: any) => {
			this.notebookId = noteInfo.notebookId;

			if (this.notebookId === '') {
				this.notebookId = 'global';
			}

			const message = this.firestore
				.collection(`chats/${this.notebookId}/messages`, (ref) =>
					ref.orderBy('createdAt', 'asc')
				)
				.snapshotChanges()
				.pipe(
					map((snaps) =>
						snaps.map((snap) => ({
							...(snap.payload.doc.data() as {}),
						}))
					)
				);

			message.subscribe((payload: any) => {
				this.messages = [];
				payload.forEach((doc) => {
					this.messages.push({
						uid: doc.uid,
						createAt: doc.createdAt,
						displayName: doc.displayName,
						photoURL: doc.photoURL,
						message: doc.message,
					});
				});
			});
		});

		if (window.innerWidth < 960) {
			this.showChat = false;
		}
	}

	/**
	 * Send data to firebase once a user has sent a message
	 */
	async sendData(sentText: string): Promise<void> {
		const messagesRef = this.firestore
			.collection('chats')
			.doc(this.notebookId)
			.collection('messages');
		await messagesRef.add({
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			...this.currentUser,
			message: sentText,
		});
	}
}
