/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, Inject, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { AddTagsTool } from '@app/components/AddTagsTool/AddTagsTool';
import firebase from 'firebase';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
	AddNoteComponent,
	CollaboratorData,
	Collaborators,
	Tag,
} from '@app/components';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	AccountService,
	NotebookService,
	NoteOperationsService,
} from '@app/services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-explore-notes',
	templateUrl: './explore-notes-editor.component.html',
	styleUrls: ['./explore-notes-editor.component.scss'],
})
export class ExploreNotesEditorComponent implements OnInit {
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

	tags: Tag[] = [];

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	user: any;

	isCompleted: boolean = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private notebookService: NotebookService,
		private noteOperations: NoteOperationsService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		this.isCompleted = false;
		this.loadReadonly(this.data.noteId, this.data.title);
		this.user = this.data.user;
	}

	/**
	 * Load the editor and render all content
	 * @param noteId
	 * @param title
	 */
	async loadReadonly(noteId: string, title: string) {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.noteTitle = title;
		this.noteId = noteId;

		if (this.Editor === undefined || window.outerWidth <= 600) {
			/**
			 * Create the notebook with all the plugins
			 */
			this.Editor = new EditorJS({
				holder: 'exploreEditor',
				tools: {
					snippet: AddTagsTool,
					header: {
						class: this.Header,
						shortcut: 'CTRL+SHIFT+H',
					},
					linkTool: {
						class: this.LinkTool,
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
					},
					delimiter: this.Delimiter,
					alert: this.Alert,
				},
				data: {
					blocks: [],
				},
				autofocus: true,
			});
		}

		await this.Editor.isReady;

		const editor = this.Editor;

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
					editor.render(snap.val().outputData);
				});

				this.isCompleted = true;
			});
	}

	/**
	 * Clone a note
	 */
	cloneNote() {
		this.isCompleted = false;

		this.noteOperations.getUserNotebooks().subscribe((options: any) => {
			// console.log(options);

			this.isCompleted = true;

			this.noteOperations.cloneNote(options).subscribe((newNoteId) => {
				this.Editor.save().then((outputData) => {
					firebase.database().ref(`notebook/${newNoteId}`).set({
						outputData,
					});
				});
			});
		});
	}
}
