/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import firebase from 'firebase';
import 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import {
	AccountService,
	NotebookObservablesService,
	NotebookOperationsService,
	NotebookService,
	NoteOperationsService,
	NotificationService,
	ProfileService,
} from '@app/services';
import {
	NotebookBottomSheetComponent,
	SmartAssistBottomSheetComponent,
} from '@app/mobile';
import { AddTagsTool } from '@app/components/AddTagsTool/AddTagsTool';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
	NoteInfoComponent,
	SmartAssistModalComponent,
	ViewProfileComponent,
} from '@app/components';

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
export class EditorComponent implements OnInit, AfterContentInit {
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

	tags: string[] = [];

	collaborators: Collaborators[] = [];

	creator: Collaborators = {
		name: '',
		url: '',
		id: '',
	};

	date: string = '';

	notebookID: string = '';

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	noteDescription: string = 'Smart Student';

	panelOpenState = false;

	showMore: boolean = false;

	notebook: any;

	user: any;

	private: boolean = true;

	opened: boolean = false;

	notebookTitle = '';

	doneLoading: boolean = false;

	nrOfNotesLoaded = 0;

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
	 * @param notebookObservables
	 * @param notebookOperations
	 * @param notificationService
	 * @param accountService
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog,
		private bottomSheet: MatBottomSheet,
		private notesService: NoteOperationsService,
		private profileService: ProfileService,
		private notebookObservables: NotebookObservablesService,
		private notebookOperations: NotebookOperationsService,
		private notificationService: NotificationService,
		private accountService: AccountService
	) {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	ngAfterContentInit(): void {
		this.notebookObservables.closeEditor.subscribe((close: any) => {
			if (close.close) {
				this.showDefaultImage();
				this.noteInfoAccordion.close();
				this.opened = false;
				this.notebookObservables.setCloseEditor(false);
			}
		});
	}

	ngOnInit(): void {
		this.nrOfNotesLoaded = 0;
		this.doneLoading = true;
		this.notebookObservables.loadEditor.subscribe((noteInfo: any) => {
			this.nrOfNotesLoaded += 1;
			if (noteInfo.notebookId !== '' && this.nrOfNotesLoaded === 1) {
				this.noteTitle = noteInfo.title;
				this.noteId = noteInfo.noteId;
				this.notebookID = noteInfo.notebookId;
				this.notebookTitle = noteInfo.notebookTitle;
				this.noteDescription = noteInfo.description;

				this.loadEditor(
					noteInfo.notebookId,
					noteInfo.noteId,
					noteInfo.title,
					noteInfo.notebookTitle,
					noteInfo.description,
					noteInfo.tags
				);
			}
		});

		this.notebookObservables.notebookPrivacy.subscribe((privacy: any) => {
			this.private = privacy.private;
		});
	}

	getNotebook(notebookId: string): void {
		this.notebookOperations
			.getNotebookInfo(notebookId)
			.subscribe((data) => {
				this.date = data.date;
				this.notebook = data.notebook;
				// this.tags = data.tags;
				this.collaborators = data.collaborators;
				this.creator = data.creator;
				this.private = data.notebook.private;
				this.opened = true;
				this.notebookID = notebookId;
				this.doneLoading = true;
			});
	}

	/**
	 * Instantiate a new editor if one does not exist yet and load previously saved data
	 * @param notebookId
	 * @param noteId
	 * @param title
	 * @param notebookTitle
	 * @param description
	 * @param tags
	 */
	async loadEditor(
		notebookId: string,
		noteId: string,
		title: string,
		notebookTitle: string,
		description: string,
		tags: string[]
	) {
		console.log(tags);
		this.notebookTitle = notebookTitle;

		this.tags = tags;

		this.noteTitle = title;

		this.noteDescription = description;

		this.doneLoading = false;

		this.opened = false;

		this.getNotebook(notebookId);

		if (this.Editor === undefined || window.outerWidth <= 600) {
			/**
			 * Create the notebook with all the plugins
			 */
			// const editor = new EditorJS({
			this.Editor = new EditorJS({
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

			// this.Editor = editor;

			const e = document.getElementById('editor') as HTMLElement;
			e.style.display = 'none';
		}

		await this.Editor.isReady;

		const e = document.getElementById('editor') as HTMLElement;
		e.style.overflowY = 'none';
		e.style.display = 'block';
		e.style.backgroundImage = 'none';
		// e.style.backgroundColor = 'grey';

		const editor = this.Editor;

		editor.clear();

		this.noteId = noteId;

		// Change the path to the correct notebook's path
		const dbRefObject = firebase.database().ref(`notebook/${this.noteId}`);

		/**
		 * Get the values from the realtime database and insert block if notebook is empty
		 */
		dbRefObject
			.once('value', (snap) => {
				if (snap.val() === null) {
					firebase
						.database()
						.ref(`notebook/${this.noteId}`)
						.set({
							outputData: {
								blocks: [
									{
										id: 'jTFbQOD8j3',
										type: 'header',
										data: {
											text: `${this.noteTitle} 🚀`,
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
			});
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
		// this.editorFocussed();

		this.Editor.save()
			.then((outputData) => {
				// console.log(this.notebookID, outputData);

				if (outputData.blocks.length > 0) {
					firebase.database().ref(`notebook/${this.noteId}`).set({
						outputData,
					});
				}
			})
			.catch(() => {
				// console.log('Saving failed: ', error);
			});
	}

	/**
	 * Highlight the block where a user is busy editing the note
	 */
	editorFocussed() {
		const index = this.Editor.blocks.getCurrentBlockIndex();

		const blocks = document.getElementById('editor').children[0].children[0]
			.children as HTMLCollection;

		let block = blocks[index] as HTMLElement;

		let nBlock = null;
		for (let i = 0; i < blocks.length; i += 1) {
			nBlock = blocks[i].children[0] as HTMLElement;
			if (i !== index) {
				if (nBlock.style.backgroundColor === 'rgba(8, 85, 116, 0.2)') {
					nBlock.style.backgroundColor = 'transparent';
				}
			}
		}

		if (block) {
			block = block.children[0] as HTMLElement;
			block.style.backgroundColor = 'rgba(8,85,116,0.2)';
			block.style.borderRadius = '5px';
		}
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

					this.noteTitle = '';

					this.removeNoteCard(this.noteId);

					this.showDefaultImage();
				}
			});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	removeNoteCard(_id: string) {}

	/**
	 * Display a default image and hide the editor when no note is opened
	 */
	showDefaultImage() {
		const e = document.getElementById('editor') as HTMLElement;
		e.style.backgroundImage = 'url(notebook-placeholder-background.png)';

		if (this.Editor) this.Editor.destroy();
		// @ts-ignore
		this.Editor = undefined;
		this.noteTitle = 'Smart Student';
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
			editor.style.height = `${vh - 402}px`;
		} else {
			editor.style.height = `${vh - 160}px`;
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
			this.tags.push(value);
		}

		// Clear the input value
		event.chipInput!.clear();

		this.updateTags();
	}

	updateTags() {
		const tagList: string[] = [];
		for (let i = 0; i < this.tags.length; i += 1) {
			tagList.push(this.tags[i]);
		}

		const request = {
			notebookId: this.notebook.notebookId,
			noteId: this.noteId,
			name: this.noteTitle,
			// description: this.noteDescription,
			creatorId: this.creator.id,
			tags: tagList,
		};

		// console.log(request);
		this.notebookService.updateNote(request).subscribe();
	}

	/**
	 * Remove a tag from input and tags array
	 * @param tag the tag to be removed
	 */
	removeTag(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}

		this.updateTags();
	}

	addCollaborator() {
		this.notebookOperations
			.requestCollaborator(
				this.user.uid,
				this.notebook.notebookId,
				this.notebookTitle
			)
			.subscribe(
				() => {
					// console.log(status);
					this.doneLoading = true;
				},
				() => {
					this.doneLoading = true;
				}
			);
	}

	removeCollaborator(userId: string) {
		this.notebookOperations
			.removeCollaborator(userId, this.notebookID)
			.subscribe((id: string) => {
				this.collaborators = this.collaborators.filter(
					(collaborator) => collaborator.id !== id
				);
			});
	}

	openSmartAssist() {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(SmartAssistBottomSheetComponent, {
				panelClass: 'smartAssistBottomSheet',
			});
		} else {
			this.dialog.open(SmartAssistModalComponent, {
				width: '70%',
			});
		}
	}

	openBottomSheet(): void {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(NotebookBottomSheetComponent, {
				panelClass: 'bottomPanelClass',
				data: {
					notebookID: this.notebookID,
					noteId: this.noteId,
					notebookTitle: this.noteTitle,
					user: this.user,
					date: this.date,
					notebook: this.notebook,
					tags: this.tags,
					collaborators: this.collaborators,
					creator: this.creator,
				},
			});
		} else {
			this.dialog.open(NoteInfoComponent, {
				width: '100%',
				data: {
					notebookID: this.notebookID,
					noteId: this.noteId,
					notebookTitle: this.noteTitle,
					user: this.user,
					date: this.date,
					notebook: this.notebook,
					tags: this.tags,
					collaborators: this.collaborators,
					creator: this.creator,
				},
			});
		}
	}

	viewUserProfile(uid: any, displayName: string) {
		let screenWidth = '';

		if (window.innerWidth <= 1000) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		// Open dialog and populate the data attributes of the form fields
		this.dialog.open(ViewProfileComponent, {
			width: screenWidth,
			data: {
				uid,
				displayName,
			},
		});
	}
}
