import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AccountService } from '@app/services';
import firebase from 'firebase';
import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';

@Component({
	selector: 'app-note-editor',
	templateUrl: './note-editor.component.html',
	styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements AfterViewInit {
	Delta = Quill.import('delta');

	user: any;

	noteTitle = 'note one';

	quill: any;

	colours = [
		'#FF0202',
		'#FF8102',
		'#3CAEA3',
		'#FFFF02',
		'#02FF02',
		'#0E02FF',
		'#8D02FF',
		'#FF02F3',
		'#B302FF',
		'#02FFB3',
	];

	@ViewChild('editor') editor?: QuillEditorComponent;

	/**
	 * Subscribe to account service to get user information
	 * @param accountService
	 */
	constructor(private accountService: AccountService) {
		accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	async ngAfterViewInit(): Promise<void> {
		/**
		 * Set user colour, notebookId and username
		 */
		// Replace with real notebook id
		const notebookId = 'test-1-unique-xyz';
		const username = this.user.displayName;
		const colour =
			this.colours[
				Math.floor(Math.random() * 10000) % this.colours.length
			];

		/**
		 * Register to see other users cursors on quill
		 */
		Quill.register('modules/cursors', QuillCursors);

		/**
		 * Initialise quill editor
		 */
		this.quill = new Quill('#editor-container', {
			modules: {
				cursors: true,
				syntax: false,
				toolbar: '#toolbar-container',
			},
			placeholder: 'Loading...',
			theme: 'snow',
		});

		// Detect change on quill
		const change = new this.Delta();

		// Initialize doc to sync editor content
		const doc = new Y.Doc();

		// Define a shared text type on the document
		const provider = new WebrtcProvider(notebookId, doc);

		// Define a shared text type on the document
		const text = doc.getText('quill');

		const { awareness } = provider;

		awareness.setLocalStateField('user', {
			name: username,
			color: colour,
		});

		// "Bind" the quill editor to a Yjs text type.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const binding = new QuillBinding(text, this.quill, awareness);

		// Remove the selection when the iframe is blurred
		window.addEventListener('blur', () => {
			this.quill.blur();
		});
		this.quill.on('text-change', (delta, oldDelta, source) => {
			if (source === 'user') {
				const changes = change.compose(delta);
				firebase.database().ref(`notes/${notebookId}`).set({
					changes,
				});
			}
		});

		// connection to firebase
		const dbRefObject = firebase.database().ref(`notes/${notebookId}`);

		// render firebase content
		await dbRefObject
			.once('value', (snap) => {
				if (snap.val() === null) {
					firebase
						.database()
						.ref(`notes/${notebookId}`)
						.set({
							outputData: `<h2>${this.noteTitle}</h2>`,
						});
				}
			})
			.then(async () => {
				/**
				 * Render output on Editor
				 */
				await dbRefObject.once('value', async (snap) => {
					await this.quill.setContents(snap.val().change);
				});
			});

		// Display all users editing the notebook
		awareness.on('change', () => {
			const strings = [];
			awareness.getStates().forEach((state) => {
				if (state.user) {
					strings.push(
						`<div style="color:${state.user.color};">• ${state.user.name}</div>`
					);
				}
				document.querySelector('#users').innerHTML = strings.join('');
			});
		});
	}
}
