import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService, NotebookObservablesService } from '@app/services';
import firebase from 'firebase';
import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import { CanDeactivate } from '@angular/router';
import { SmartAssistObservablesService } from '@app/services/smartAssist/smart-assist-observables.service';

@Component({
	selector: 'app-note-editor',
	templateUrl: './note-editor.component.html',
	styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent
	implements OnInit, OnDestroy, CanDeactivate<NoteEditorComponent>
{
	Delta = Quill.import('delta');

	user: any;

	quill: any = undefined;

	nrOfNotesLoaded = 0;

	notebookId: string = '';

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	noteDescription: string = 'Smart Student';

	notebookTitle: string = 'Smart Student';

	colours = [
		'rgba(217,0,0,0.8)',
		'rgba(250,123,0,0.8)',
		'rgba(70,220,194,0.8)',
		'rgba(245,245,0,0.8)',
		'rgba(0,208,59,0.8)',
		'rgba(11,0,250,0.8)',
		'rgba(142,0,255,0.8)',
		'rgba(194,0,182,0.8)',
		'rgba(104,0,147,0.8)',
		'rgba(0,154,110,0.8)',
	];

	height: number = 0;

	toolbarHeight: number = 0;

	heightInPx: string = '100vh';

	provider: any = undefined;

	globalUserCounter: any = 0;

	loadEditorSubscription: any = undefined;

	@ViewChild('editor') editor?: QuillEditorComponent;

	/**
	 * Subscribe to account service to get user information
	 * @param accountService
	 * @param notebookObservables
	 * @param smartAssistObservables
	 */
	constructor(
		private accountService: AccountService,
		private notebookObservables: NotebookObservablesService,
		private smartAssistObservables: SmartAssistObservablesService
	) {}

	async ngOnInit(): Promise<void> {
		if (this.provider !== undefined) this.provider.destroy();

		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.loadEditorSubscription =
			this.notebookObservables.loadEditor.subscribe(
				async (noteInfo: any) => {
					if (
						this.noteId !== noteInfo.noteId &&
						noteInfo.noteId !== ''
					) {
						this.noteTitle = noteInfo.title;
						this.noteId = noteInfo.noteId;
						this.notebookId = noteInfo.notebookId;
						this.notebookTitle = noteInfo.notebookTitle;
						this.noteDescription = noteInfo.description;

						if (this.provider !== undefined)
							this.provider.destroy();

						if (this.noteId !== '') {
							if (this.quill === undefined) {
								await this.loadQuillEditor();
								if (this.noteId !== '')
									await this.editorOperations();
							} else if (this.noteId !== '')
								await this.editorOperations();
						}
					} else if (noteInfo.noteId === '') {
						this.removeNote();
					}
				}
			);

		this.notebookObservables.editorHeight.subscribe(({ height }) => {
			this.height = height;
			this.heightInPx = `${this.height - this.toolbarHeight}px`;
		});

		this.notebookObservables.dragAndDrop.subscribe(({ content }) => {
			if (content.length > 0) {
				this.addContent(content);
			}
		});

		this.notebookObservables.removeNote.subscribe((remove) => {
			if (remove !== '') {
				if (remove === this.noteId) {
					this.removeNote();
				}
			}
		});

		const counter = await firebase
			.database()
			.ref(`/status/${this.noteId}`)
			.get()
			.then((doc) => doc.val().count);

		if (counter !== undefined) {
			this.globalUserCounter = counter;
		}
	}

	removeNote() {
		this.noteTitle = 'Smart Student';
		this.noteId = '';
		this.notebookId = '';
		this.notebookTitle = '';
		this.noteDescription = '';

		// this.height += this.toolbarHeight - 30;
		this.heightInPx = `${this.height}px`;

		const changes = {
			ops: [
				{
					insert: '\n',
				},
			],
		};

		if (this.quill) this.quill.setContents(changes);
	}

	async editorOperations() {
		document.querySelector('#users').innerHTML = '';

		if (this.provider) this.provider.destroy();

		this.quill.readOnly = false;

		/**
		 * Set user colour, notebookId and username
		 */
		// Replace with real notebook id
		const username = this.user.displayName;
		const colour =
			this.colours[
				Math.floor(Math.random() * 10000) % this.colours.length
			];

		// Initialize doc to sync editor content
		const doc = new Y.Doc();

		// Define a shared text type on the document
		this.provider = new WebrtcProvider(this.noteId, doc);

		// this.smartAssistObservables.setSmartAssistNotebookId(this.notebookId);
		// this.smartAssistObservables.setSmartAssistNoteId(this.noteId);

		// Define a shared text type on the document
		const text = doc.getText('quill');

		const { awareness } = this.provider;

		awareness.setLocalStateField('user', {
			name: username,
			color: colour,
			profileUrl: this.user.profilePic,
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
				const changes = this.quill.getContents();
				firebase.database().ref(`notes/${this.noteId}`).set({
					changes,
				});
			} else {
				// console.log('not user');
			}
		});

		// connection to firebase
		const dbRefObject = firebase.database().ref(`notes/${this.noteId}`);

		// render firebase content
		await dbRefObject
			.once('value', (snap) => {
				if (snap.val() === null) {
					firebase
						.database()
						.ref(`notes/${this.noteId}`)
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
				if (this.globalUserCounter === 0) {
					await dbRefObject.once('value', async (snap) => {
						// console.log(snap.val().changes);
						await this.quill.setContents(snap.val().changes);
					});
				}
			});

		// Display all users editing the notebook
		awareness.on('change', async () => {
			const strings = [];
			awareness.getStates().forEach((state) => {
				if (state.user) {
					strings.push(
						`<div class="text-center" style="
              border-radius: 18px;
              width: 36px;
              height: 36px;
              display: inline-block;
              margin-right: 7px;
              border: 3px solid ${state.user.color};
            ">
                <div style="
                  background-image: url(${state.user.profileUrl});
                  background-size: cover;
                  background-position: center;
                  margin: 2px;
                  width: 26px;
                  height: 26px;
                  border-radius: 14px;
                "></div>
              </div>`
					);
				}
				document.querySelector('#users').innerHTML = strings.join('');

				this.toolbarHeight =
					document.getElementById('toolbar').offsetHeight;
				this.heightInPx = `${this.height - this.toolbarHeight}px`;
			});

			if (this.noteId !== '') {
				await firebase
					.database()
					.ref(`/status/${this.noteId}`)
					.set({ count: strings.length });
			}
		});

		if (this.toolbarHeight === 0) {
			this.toolbarHeight =
				document.getElementById('toolbar').offsetHeight;
			this.heightInPx = `${this.height - this.toolbarHeight}px`;
		} else {
			this.toolbarHeight =
				document.getElementById('toolbar').offsetHeight;
		}
	}

	async loadQuillEditor() {
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
			// placeholder: 'Loading...',
			theme: 'snow',
			readOnly: false,
		});
	}

	async ngOnDestroy(): Promise<void> {
		if (this.provider) this.provider.destroy();
		if (this.loadEditorSubscription)
			this.loadEditorSubscription.unsubscribe();
	}

	/**
	 * Handler for when content from the smart assist panel is drag & dropped into the notebook
	 * @param event get the content that is dropped
	 */
	async drop(event: any) {
		const parser = new DOMParser();

		const e = event.item.element.nativeElement.innerHTML;

		const doc = parser.parseFromString(e, 'text/html');

		const content = doc.getElementsByClassName('snippetContent');
		const title = doc.getElementsByClassName('snippetTitle')[0].innerHTML;

		const recNoteId = doc
			.getElementsByClassName('snippetContentHeader')[0]
			.getAttribute('data-noteId');

		console.log(recNoteId);

		let changes = [];

		await firebase
			.database()
			.ref(`notes/${recNoteId}`)
			.get()
			.then((docdata) => {
				changes = docdata.val().changes.ops;
			});

		console.log(changes);

		this.addContent(changes);
	}

	addContent(content: any[]) {
		let changes = this.quill.getContents();

		changes = changes.ops.concat(content);

		// for (let i = 0; i < content.length; i += 1) {
		// 	changes.ops.push({
		// 		insert: `${content[i].insert}\n`,
		// 	});
		// }

		this.quill.setContents(changes);

		firebase.database().ref(`notes/${this.noteId}`).set({
			changes,
		});
	}

	canDeactivate() {
		if (this.provider) this.provider.destroy();
		if (this.loadEditorSubscription)
			this.loadEditorSubscription.unsubscribe();
		return true;
	}
}
