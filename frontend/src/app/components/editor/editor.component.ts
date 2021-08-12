/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, OnInit, ViewChild } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import firebase from 'firebase';
import 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import {
	NotebookService,
	NotebookEventEmitterService,
	ProfileService,
	NotesService,
	NoteMoreService,
} from '@app/services';
import { NotebookBottomSheetComponent } from '@app/mobile';
import { AddTagsTool } from '@app/components/AddTagsTool/AddTagsTool';
import { MatExpansionPanel } from '@angular/material/expansion';
// import { MatProgressBar } from '@angular/material/progress-bar';

export interface Tag {
	name: string;
}

export interface Collaborators {
	name: string;
	url: string;
	id: string;
}

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
	/**
    Get all plugins for notebook
   */

	Header = require('@editorjs/header');

	LinkTool = require('@editorjs/link');

	RawTool = require('@editorjs/raw');

	SimpleImage = require('@editorjs/simple-image');

	Checklist = require('@editorjs/checklist');

	List = require('@editorjs/list');

	Embed = require('@editorjs/embed');

	Quote = require('@editorjs/quote');

	NestedList = require('@editorjs/nested-list');

	Underline = require('@editorjs/underline');

	Table = require('@editorjs/table');

	Warning = require('@editorjs/warning');

	CodeTool = require('@editorjs/code');

	// Paragraph = require('@editorjs/paragraph');

	TextVariantTune = require('@editorjs/text-variant-tune');

	AttachesTool = require('@editorjs/attaches');

	Marker = require('@editorjs/marker');

	InlineCode = require('@editorjs/inline-code');

	Personality = require('@editorjs/personality');

	Delimiter = require('@editorjs/delimiter');

	Alert = require('editorjs-alert');

	Paragraph = require('editorjs-paragraph-with-alignment');

	Editor!: EditorJS;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	tags: Tag[] = [];

	collaborators: Collaborators[] = [];

	creator: Collaborators = {
		name: '',
		url: '',
		id: '',
	};

	date: string = '';

	notebookID: string = '';

	noteId: string = '';

	notebookTitle: string = 'Smart Student';

	static staticNotebookID: string = '';

	static staticNoteId: string = '';

	static staticNotebookTitle: string = 'Smart Student';

	panelOpenState = false;

	showMore: boolean = false;

	notebook: any;

	user: any;

	private: boolean = true;

	opened: boolean = false;

	@ViewChild('editorContainer') editorContainer!: HTMLDivElement;

	@ViewChild('progressBar') progressBar!: HTMLElement;

	@ViewChild('noteInfoAccordion') noteInfoAccordion!: MatExpansionPanel;

	/**
	 * Editor component constructor
	 * @param notebookService To call methods that apply to the notebooks
	 * @param dialog Show dialog when a user wants to delete a notebook for example
	 * @param bottomSheet
	 * @param notesService
	 * @param profileService
	 * @param noteMore
	 * @param notebookEventEmitterService
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private bottomSheet: MatBottomSheet,
		private notesService: NotesService,
		private profileService: ProfileService,
		private noteMore: NoteMoreService,
		private notebookEventEmitterService: NotebookEventEmitterService
	) {}

	ngOnInit(): void {
		if (this.notebookEventEmitterService.subsVar === undefined) {
			this.notebookEventEmitterService.subsVar =
				this.notebookEventEmitterService.loadEmitter.subscribe(
					({ notebookId, noteId, title }) => {
						this.loadEditor(notebookId, noteId, title);
					}
				);

			this.notebookEventEmitterService.closeNoteEmitter.subscribe(() => {
				this.showDefaultImage();
				this.noteInfoAccordion.close();
				this.opened = false;
			});

			this.notebookEventEmitterService.changePrivacyEmitter.subscribe(
				(privacy: boolean) => {
					this.private = privacy;
				}
			);
		}
	}

	getNotebook(notebookId: string): void {
		this.noteMore.getNotebookInfo(notebookId).subscribe((data) => {
			this.date = data.date;
			this.notebook = data.notebook;
			this.tags = data.tags;
			this.collaborators = data.collaborators;
			this.creator = data.creator;
			this.private = data.notebook.private;
			this.opened = true;
		});
	}

	/**
	 * Instantiate a new editor if one does not exist yet and load previously saved data
	 * @param notebookId
	 * @param noteId
	 * @param title
	 */
	async loadEditor(notebookId: string, noteId: string, title: string) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.getNotebook(notebookId);

		if (this.Editor === undefined || window.outerWidth <= 600) {
			/**
			 * Create the notebook with all the plugins
			 */
			const editor = new EditorJS({
				holder: 'editor',
				tools: {
					snippet: AddTagsTool,
					header: {
						class: this.Header,
						shortcut: 'CTRL+SHIFT+H',
					},
					linkTool: {
						class: this.LinkTool,
						// config: {
						//   endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
						// }
					},
					raw: this.RawTool,
					image: this.SimpleImage,
					checklist: {
						class: this.Checklist,
						inlineToolbar: true,
					},
					list: {
						class: this.NestedList,
						inlineToolbar: true,
					},
					embed: this.Embed,
					quote: this.Quote,
					underline: this.Underline,
					table: {
						class: this.Table,
					},
					warning: {
						class: this.Warning,
						inlineToolbar: true,
						shortcut: 'CTRL+SHIFT+W',
						config: {
							titlePlaceholder: 'Title',
							messagePlaceholder: 'Message',
						},
					},
					code: this.CodeTool,
					paragraph: {
						class: this.Paragraph,
						inlineToolbar: true,
					},
					textVariant: this.TextVariantTune,
					attaches: {
						class: this.AttachesTool,
						// config: {
						//   endpoint: 'http://localhost:8008/uploadFile'
						// }
					},
					Marker: {
						class: this.Marker,
						shortcut: 'CTRL+SHIFT+M',
					},
					inlineCode: {
						class: this.InlineCode,
						shortcut: 'CMD+SHIFT+M',
					},
					personality: {
						class: this.Personality,
						// config: {
						//   endpoint: 'http://localhost:8008/uploadFile'  // Your backend file uploader endpoint
						// }
					},
					delimiter: this.Delimiter,
					alert: this.Alert,
				},
				data: {
					blocks: [],
				},
				autofocus: true,

				onChange: () => {
					this.saveContent();
				},
			});

			this.Editor = editor;

			const e = document.getElementById('editor') as HTMLElement;
			e.style.display = 'none';
		}

		await this.Editor.isReady;

		const progressbar = document.getElementById(
			'progressbar'
		) as HTMLElement;

		if (progressbar) progressbar.style.display = 'block';

		this.Editor.styles.loader = 'mat-spinner';

		let e = document.getElementById('editor') as HTMLElement;
		e.style.overflowY = 'none';
		e.style.display = 'block';
		e.style.backgroundImage = 'none';
		// e.style.backgroundColor = 'grey';

		const editor = this.Editor;

		editor.clear();

		/**
		 * Get the specific notebook details with notebook id
		 */
		this.notebookTitle = title;
		this.noteId = noteId;
		this.notebookID = notebookId;

		EditorComponent.staticNotebookID = notebookId;
		EditorComponent.staticNoteId = noteId;
		EditorComponent.staticNotebookTitle = title;

		this.notebookEventEmitterService.GetNoteTitle(title);

		// call event transmitter

		// Change the path to the correct notebook's path
		const dbRefObject = firebase.database().ref(`notebook/${noteId}`);

		/**
		 * Get the values from the realtime database and insert block if notebook is empty
		 */
		dbRefObject
			.once('value', (snap) => {
				if (snap.val() === null) {
					firebase
						.database()
						.ref(`notebook/${noteId}`)
						.set({
							outputData: {
								blocks: [
									{
										id: 'jTFbQOD8j3',
										type: 'header',
										data: {
											text: `${this.notebookTitle} 🚀`,
											level: 2,
										},
									},
								],
							},
						});
				}
			})
			.then(() => {
				/**
				 * Render output on Editor
				 */
				dbRefObject.once('value', (snap) => {
					// console.log(snap.val());
					editor.render(snap.val().outputData);
				});

				e = document.getElementById('editor') as HTMLElement;
				e.style.overflowY = 'scroll';

				if (progressbar) progressbar.style.display = 'none';
			});
		// });
	}

	/**
	 * Handler for when content from the smart assist panel is drag & dropped into the notebook
	 * @param event get the content that is dropped
	 */
	drop(event: any) {
		const parser = new DOMParser();

		const e = event.item.element.nativeElement.innerHTML;

		const doc = parser.parseFromString(e, 'text/html');

		const content = doc.getElementsByClassName('snippetContent');
		const title = doc.getElementsByClassName('snippetTitle');

		// Add the title
		this.Editor.blocks.insert(title[0].getAttribute('data-type')!, {
			text: title[0].innerHTML,
		});

		for (let i = 0; i < content.length; i += 1) {
			// console.log(content[i].innerHTML);
			// Add content
			this.Editor.blocks.insert(content[i].getAttribute('data-type')!, {
				text: content[i].innerHTML,
			});
		}

		this.saveContent();
	}

	/**
	 * Method to call when notebook content should be saved
	 */
	saveContent() {
		this.Editor.save()
			.then((outputData) => {
				// console.log(this.notebookID, outputData);

				if (outputData.blocks.length > 0) {
					firebase.database().ref(`notebook/${this.noteId}`).set({
						outputData,
					});
				}
			})
			.catch((error) => {
				console.log('Saving failed: ', error);
			});
	}

	/**
	 * Delete a notebook
	 */
	removeNote() {
		this.notesService
			.removeNote(this.notebookID, this.noteId)
			.subscribe((removed: any) => {
				if (removed) {
					const editor = this.Editor;
					editor.clear();

					this.notebookTitle = '';

					this.removeNoteCard(this.noteId);

					this.showDefaultImage();
				}
			});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	removeNoteCard(_id: string) {}

	showDefaultImage() {
		const e = document.getElementById('editor') as HTMLElement;
		e.style.backgroundImage = 'url(notebook-placeholder-background.png)';

		this.Editor.destroy();
		// @ts-ignore
		this.Editor = undefined;
		this.notebookTitle = 'Smart Student';
	}

	/**
	 * Show menu when user clicks on ellipsis
	 * @param event To prevent the accordion from opening and closing when ellipsis is clicked
	 */
	showMoreOptions(event: Event) {
		event.stopPropagation();
	}

	/**
	 * When the accordion is opened and closed, adjust the height of the notebook
	 */
	openClosePanel() {
		this.panelOpenState = !this.panelOpenState;

		const editor = document.getElementById('editor') as HTMLElement;

		const vh = window.innerHeight;

		if (this.panelOpenState) {
			const p = `${vh - 402}px`;
			editor.style.height = p;
		} else {
			const p = `${vh - 160}px`;
			editor.style.height = p;
		}
	}

	/**
	 * Insert new tags to the input and tags array
	 * @param event To get the value from the newly inserted tag
	 */
	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.tags.push({ name: value });
		}

		// Clear the input value
		event.chipInput!.clear();

		this.updateTags();
	}

	updateTags() {
		const tagList: string[] = [];
		for (let i = 0; i < this.tags.length; i += 1) {
			tagList.push(this.tags[i].name);
		}

		this.noteMore.updateNotebookTags({
			title: this.notebook.title,
			author: this.notebook.author,
			course: this.notebook.course,
			description: this.notebook.description,
			institution: this.notebook.institution,
			creatorId: this.notebook.creatorId,
			private: this.notebook.private,
			tags: tagList,
			notebookId: this.notebook.notebookId,
		});
	}

	/**
	 * Remove a tag from input and tags array
	 * @param tag the tag to be removed
	 */
	removeTag(tag: Tag): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}

		this.updateTags();
	}

	addCollaborator() {
		this.noteMore
			.addCollaborator(this.notebookID)
			.subscribe((collaborator: any) => {
				this.collaborators.push(collaborator);
			});
	}

	removeCollaborator(userId: string) {
		this.noteMore
			.removeCollaborator(userId, this.notebookID)
			.subscribe((id: string) => {
				this.collaborators = this.collaborators.filter(
					(collaborator) => collaborator.id !== id
				);
			});
	}

	openBottomSheet(): void {
		this.bottomSheet.open(NotebookBottomSheetComponent, {
			panelClass: 'bottomPanelClass',
			data: {
				notebookID: EditorComponent.staticNotebookID,
				noteId: EditorComponent.staticNoteId,
				notebookTitle: EditorComponent.staticNotebookTitle,
			},
		});
	}
}
