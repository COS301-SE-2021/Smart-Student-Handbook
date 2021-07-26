import { Component, OnInit, ViewChild } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import firebase from 'firebase';
import 'firebase/firestore';
import { NotebookService } from 'src/app/services/notebook.service';

import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../modals/confirm-delete/confirm-delete.component';

export interface Tag {
	name: string;
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
	// @ts-ignore
	Header = require('@editorjs/header');

	// @ts-ignore
	LinkTool = require('@editorjs/link');

	// @ts-ignore
	RawTool = require('@editorjs/raw');

	// @ts-ignore
	SimpleImage = require('@editorjs/simple-image');

	// @ts-ignore
	Checklist = require('@editorjs/checklist');

	// @ts-ignore
	List = require('@editorjs/list');

	// @ts-ignore
	Embed = require('@editorjs/embed');

	// @ts-ignore
	Quote = require('@editorjs/quote');

	// @ts-ignore
	NestedList = require('@editorjs/nested-list');

	// @ts-ignore
	Underline = require('@editorjs/underline');

	// @ts-ignore
	Table = require('@editorjs/table');

	// @ts-ignore
	Warning = require('@editorjs/warning');

	// @ts-ignore
	CodeTool = require('@editorjs/code');

	// @ts-ignore
	// Paragraph = require('@editorjs/paragraph');
	// @ts-ignore
	TextVariantTune = require('@editorjs/text-variant-tune');

	// @ts-ignore
	AttachesTool = require('@editorjs/attaches');

	// @ts-ignore
	Marker = require('@editorjs/marker');

	// @ts-ignore
	InlineCode = require('@editorjs/inline-code');

	// @ts-ignore
	Personality = require('@editorjs/personality');

	// @ts-ignore
	Delimiter = require('@editorjs/delimiter');

	// @ts-ignore
	Alert = require('editorjs-alert');

	// @ts-ignore
	Paragraph = require('editorjs-paragraph-with-alignment');

	_editor!: EditorJS;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	tags: Tag[] = [
		{ name: 'tag1' },
		{ name: 'tag2' },
		{ name: 'tag3' },
		{ name: 'tag4' },
	];

	notebookID!: string;

	notebookTitle: string = 'Smart Student';

	panelOpenState = false;

	showMore: boolean = false;

	@ViewChild('editorContainer') editorContainer!: HTMLDivElement;

	/**
	 * Handler for when content from the smart assist panel is drag & dropped into the notebook
	 * @param event get the content that is dropped
	 */
	drop(event: CdkDragDrop<string[]>) {
		const parser = new DOMParser();

		const e = event.item.element.nativeElement.innerHTML;

		const doc = parser.parseFromString(e, 'text/html');

		const content = doc.getElementsByClassName('snippetContent');
		const title = doc.getElementsByClassName('snippetTitle');

		// Add the title
		this._editor.blocks.insert(title[0].getAttribute('data-type')!, {
			text: title[0].innerHTML,
		});

		for (let i = 0; i < content.length; i++) {
			// console.log(content[i].innerHTML);
			// Add content
			this._editor.blocks.insert(content[i].getAttribute('data-type')!, {
				text: content[i].innerHTML,
			});
		}

		this.saveContent();
	}

	/**
	 * Editor component constructor
	 * @param notebookService To call methods that apply to the notebooks
	 * @param dialog Show dialog when a user wants to delete a notebook for example
	 */
	constructor(
		private notebookService: NotebookService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {}

	/**
	 * Instantiate a new editor if one does not exist yet and load previously saved data
	 * @param id the id of the notebook to load
	 */
	async loadEditor(id: string) {
		this.notebookID = id;

		if (this._editor === undefined) {
			/**
			 * Create the notebook with all the plugins
			 */
			const editor = new EditorJS({
				holder: 'editor',
				tools: {
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

			this._editor = editor;

			const e = document.getElementById('editor') as HTMLElement;
			e.style.display = 'none';
		}

		await this._editor.isReady;

		this._editor.styles.loader = 'mat-spinner';

		const editorLoad = document.getElementsByClassName('codex-editor')!;

		editorLoad[0].classList.add('cdx-loader');

		let e = editorLoad[0] as HTMLElement;
		e.style.border = 'none';

		e = document.getElementById('editor') as HTMLElement;
		e.style.overflowY = 'none';
		e.style.display = 'block';

		const editor = this._editor;

		editor.clear();

		/**
		 * Get the specific notebook details with notebook id
		 */
		this.notebookService.getNoteBookById(id).subscribe((result) => {
			this.notebookTitle = result.title;

			// Change the path to the correct notebook's path
			const dbRefObject = firebase.database().ref(`notebook/${id}`);

			/**
			 * Get the values from the realtime database and insert block if notebook is empty
			 */
			dbRefObject
				.once('value', (snap) => {
					if (snap.val() === null) {
						firebase
							.database()
							.ref(`notebook/${id}`)
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

					editorLoad[0].classList.remove('cdx-loader');
					e = document.getElementById('editor') as HTMLElement;
					e.style.overflowY = 'scroll';
				});
		});
	}

	/**
	 * Method to call when notebook content should be saved
	 */
	saveContent() {
		this._editor
			.save()
			.then((outputData) => {
				// console.log(this.notebookID, outputData);

				if (outputData.blocks.length > 0) {
					firebase.database().ref(`notebook/${this.notebookID}`).set({
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
	removeNotebook() {
		const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
			// width: '50%',
		});

		// Get info and create notebook after dialog is closed
		dialogRef.afterClosed().subscribe((result) => {
			if (result === true) {
				if (this.notebookID != '') {
					this.notebookService
						.removeNotebook(this.notebookID)
						.subscribe(
							(result) => {
								console.log(result);

								// this._router.navigate(['notebook']);

								// this.folderPanelComponent.getUserNotebooks();
								const editor = this._editor;
								editor.clear();

								this.notebookTitle = '';
								// this.notePanelComponent.getUserNotebooks();
							},
							(error) => {
								// this._router.navigate(['notebook']);
								//
								// this.folderPanelComponent.getUserNotebooks();
								//
								// let editor = this._editor;
								// editor.clear();
								//
								// this.notebookTitle = '';
							}
						);
				}
			}
		});
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
	}
}
