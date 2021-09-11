import { AfterViewInit, Component, ViewChild } from '@angular/core';
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

	noteTitle = 'note one';

	quill: any;

	colours = ['#173F5F', '#20639B', '#3CAEA3', '#F6D55C', '#ED553B'];

	@ViewChild('editor') editor?: QuillEditorComponent;

	async ngAfterViewInit(): Promise<void> {
		Quill.register('modules/cursors', QuillCursors);
		// TODO Notebook Id replace with test-1
		// TODO username
		const notebookId = 'test-1';
		const username = 'user 1';
		const colour =
			this.colours[
				Math.floor(Math.random() * 10000) % this.colours.length
			];

		this.quill = new Quill('#editor-container', {
			modules: {
				cursors: true,
				syntax: false,
				toolbar: '#toolbar-container',
			},
			placeholder: 'Compose an epic...',
			theme: 'snow',
		});

		const change = new this.Delta();

		const ydoc = new Y.Doc();

		const provider = new WebrtcProvider(notebookId, ydoc);

		// Define a shared text type on the document
		const ytext = ydoc.getText('quill');

		const { awareness } = provider;

		awareness.setLocalStateField('user', {
			name: username,
			color: colour,
		});

		// "Bind" the quill editor to a Yjs text type.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const binding = new QuillBinding(ytext, this.quill, awareness);

		// propagate the username from the input element to all users
		// observe changes on the input element that contains the username

		// Remove the selection when the iframe is blurred
		window.addEventListener('blur', () => {
			this.quill.blur();
		});
		// this.quill.on('text-change', (delta: any, source: any) => {
		// 	if (source === 'user') {
		// 		console.log('user');
		// 	} else {
		// 		console.log('not user');
		// 	}
		// 	change = change.compose(delta);
		// 	firebase.database().ref(`notes/${notebookId}`).set({
		// 		change,
		// 	});
		// });
		this.quill.on('text-change', (delta, oldDelta, source) => {
			if (source === 'user') {
				console.log('user');
				const changes = change.compose(delta);
				firebase.database().ref(`notes/${notebookId}`).set({
					changes,
				});
			} else {
				console.log('not user');
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
	}

	onSubmit() {}
}
