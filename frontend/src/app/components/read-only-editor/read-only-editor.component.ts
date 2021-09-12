import { AfterViewInit, Component, ViewChild } from '@angular/core';
import firebase from 'firebase';
import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

@Component({
	selector: 'app-read-only-editor',
	templateUrl: './read-only-editor.component.html',
	styleUrls: ['./read-only-editor.component.scss'],
})
export class ReadOnlyEditorComponent implements AfterViewInit {
	noteTitle = 'note one';

	quill: any;

	isCompleted: boolean = false;

	@ViewChild('editor') editor?: QuillEditorComponent;

	constructor(private exploreObservables: ExploreObservablesService) {}

	async ngAfterViewInit(): Promise<void> {
		this.exploreObservables.openExploreViewNote.subscribe(
			async ({ noteId, title }) => {
				this.noteTitle = title;

				this.quill = new Quill('#readonlyEditor', {
					modules: {
						syntax: false,
					},
					placeholder: 'Loading...',
					readOnly: true,
					theme: 'bubble',
				});

				// window.addEventListener('blur', () => {
				// 	this.quill.blur();
				// });

				// connection to firebase
				const dbRefObject = firebase.database().ref(`notes/${noteId}`);

				// render firebase content
				await dbRefObject
					.once('value', (snap) => {
						if (snap.val() === null) {
							firebase
								.database()
								.ref(`notes/${noteId}`)
								.set({
									changes: {
										ops: [
											{
												insert: `${this.noteTitle}`,
											},
										],
									},
								});
						}
					})
					.then(async () => {
						/**
						 * Render output on Editor
						 */
						await dbRefObject.once('value', async (snap) => {
							console.log(snap.val());
							await this.quill.setContents(snap.val().changes);

							this.isCompleted = true;
						});
					});
			}
		);
	}
}
