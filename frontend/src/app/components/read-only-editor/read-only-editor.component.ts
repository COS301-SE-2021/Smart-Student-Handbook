import { AfterViewInit, Component, ViewChild } from '@angular/core';
import firebase from 'firebase';
import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
	selector: 'app-read-only-editor',
	templateUrl: './read-only-editor.component.html',
	styleUrls: ['./read-only-editor.component.scss'],
})
export class ReadOnlyEditorComponent implements AfterViewInit {
	noteTitle = 'note one';

	quill: any;

	@ViewChild('editor') editor?: QuillEditorComponent;

	async ngAfterViewInit(): Promise<void> {
		const notebookId = 'test-1';

		this.quill = new Quill('#editor-container', {
			modules: {
				syntax: false,
				toolbar: '#toolbar-container',
			},
			placeholder: 'Loading...',
			readOnly: true,
			theme: 'bubble',
		});

		window.addEventListener('blur', () => {
			this.quill.blur();
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
}
