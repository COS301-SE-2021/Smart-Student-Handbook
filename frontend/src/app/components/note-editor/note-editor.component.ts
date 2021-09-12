import {
	AfterViewInit,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { AccountService, NotebookObservablesService } from '@app/services';
import firebase from 'firebase';
import Quill from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-note-editor',
	templateUrl: './note-editor.component.html',
	styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, AfterViewInit, OnDestroy {
	Delta = Quill.import('delta');

	user: any;

	quill: any;

	nrOfNotesLoaded = 0;

	notebookId: string = '';

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	noteDescription: string = 'Smart Student';

	notebookTitle: string = 'Smart Student';

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

	height: number = 0;

	toolbarHeight: number = 0;

	heightInPx: string = '100vh';

	provider: any = undefined;

	loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

	loadedSubscription: any;

	@ViewChild('editor') editor?: QuillEditorComponent;

	/**
	 * Subscribe to account service to get user information
	 * @param accountService
	 * @param notebookObservables
	 */
	constructor(
		private accountService: AccountService,
		private notebookObservables: NotebookObservablesService
	) {}

	ngOnInit(): void {
		if (this.provider !== undefined) this.provider.destroy();

		this.loaded = new BehaviorSubject(false);

		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.notebookObservables.loadEditor.subscribe(async (noteInfo: any) => {
			this.nrOfNotesLoaded += 1;
			if (noteInfo.notebookId !== '') {
				this.noteTitle = noteInfo.title;
				this.noteId = noteInfo.noteId;
				this.notebookId = noteInfo.notebookId;
				this.notebookTitle = noteInfo.notebookTitle;
				this.noteDescription = noteInfo.description;

				this.loadedSubscription = this.loaded.subscribe((load) => {
					if (load) {
						this.editorOperations();
					}
				});
			}
		});

		this.notebookObservables.editorHeight.subscribe(({ height }) => {
			console.log(height);
			this.height = height - this.toolbarHeight;
			this.heightInPx = `${this.height}px`;
		});
	}

	async ngAfterViewInit(): Promise<void> {
		await this.loadQuillEditor();
	}

	async editorOperations() {
		if (this.provider) this.provider.destroy();

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

		// Define a shared text type on the document
		const text = doc.getText('quill');

		const { awareness } = this.provider;

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
				await dbRefObject.once('value', async (snap) => {
					await this.quill.setContents(snap.val().changes);
				});
			});

		// Display all users editing the notebook
		awareness.on('change', () => {
			const strings = [];
			awareness.getStates().forEach((state) => {
				if (state.user) {
					strings.push(
						// `<div style="color:${state.user.color};">• ${state.user.name}</div>`
						`<div class="text-center" style="border: 2px solid ${
							state.user.color
						}; border-radius: 13px; width: 26px; height: 26px; padding-top: 1px;">${state.user.name.substr(
							0,
							1
						)}</div>`
					);
				}
				document.querySelector('#users').innerHTML = strings.join('');
			});
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
		});

		this.loaded.next(true);

		if (window.innerWidth < 960) {
			this.loaded.complete();
		}
	}

	ngOnDestroy(): void {
		console.log('beye');
		if (this.provider) this.provider.destroy();
	}
}
