/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, Inject, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Collaborators, Tag } from '@app/components';
import { AddTagsTool } from '@app/components/AddTagsTool/AddTagsTool';
import firebase from 'firebase';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-explore-notes-bottom-sheet',
	templateUrl: './explore-notes-editor-bottom-sheet.component.html',
	styleUrls: ['./explore-notes-editor-bottom-sheet.component.scss'],
})
export class ExploreNotesEditorBottomSheetComponent implements OnInit {
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

	noteTitle: string = 'Smart Student';

	static staticNotebookID: string = '';

	static staticNoteId: string = '';

	panelOpenState = false;

	showMore: boolean = false;

	notebook: any;

	user: any;

	private: boolean = true;

	opened: boolean = false;

	notebookTitle = '';

	isCompleted: boolean = false;

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ExploreNotesEditorBottomSheetComponent>
	) {}

	ngOnInit(): void {
		// console.log(this.bottomData);
		this.isCompleted = false;
		this.loadReadonly(this.data.noteId, this.data.title);
		this.user = this.data.user;
	}

	async loadReadonly(noteId: string, title: string) {
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.noteTitle = title;
		this.noteId = noteId;

		if (this.Editor === undefined || window.outerWidth <= 600) {
			/**
			 * Create the notebook with all the plugins
			 */
			// const editor = new EditorJS({
			this.Editor = new EditorJS({
				holder: 'exploreBottomSheetEditor',
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
					// console.log(snap.val());
					editor.render(snap.val().outputData);
				});

				this.isCompleted = true;
			});
		// });
	}

	closeSheet(event: MouseEvent): void {
		this.bottomSheetRef.dismiss();
		event.preventDefault();
	}
}
