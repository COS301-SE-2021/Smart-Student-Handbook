/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

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
import { MatExpansionPanel } from '@angular/material/expansion';
import {
	NoteInfoComponent,
	SmartAssistModalComponent,
	ViewProfileComponent,
} from '@app/components';
import { Platform } from '@angular/cdk/platform';

// import { MatProgressBar } from '@angular/material/progress-bar';

export interface Tag {
	name: string;
}

export interface Collaborators {
	name: string;
	url: string;
	id: string;
	accessId: string;
}

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterContentInit {
	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

	tags: string[] = [];

	collaborators: Collaborators[] = [];

	creator: Collaborators = {
		name: '',
		url: '',
		id: '',
		accessId: '',
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

	@ViewChild('accordionHeader') accordionHeader!: HTMLElement;

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
	 * @param platform
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
		private accountService: AccountService,
		public platform: Platform
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
				this.noteInfoAccordion.close();
				this.opened = false;
				this.notebookObservables.setCloseEditor(false);
			}
		});
	}

	ngOnInit(): void {
		this.setEditorHeight();

		this.nrOfNotesLoaded = 0;
		this.doneLoading = true;

		this.notebookObservables.notebookPrivacy.subscribe((privacy: any) => {
			this.private = privacy.private;
		});

		this.notebookObservables.loadEditor.subscribe((noteInfo: any) => {
			this.nrOfNotesLoaded += 1;
			if (noteInfo.notebookId !== '' && this.nrOfNotesLoaded === 1) {
				this.noteTitle = noteInfo.title;
				this.noteId = noteInfo.noteId;
				this.notebookID = noteInfo.notebookId;
				this.notebookTitle = noteInfo.notebookTitle;
				this.noteDescription = noteInfo.description;

				this.setEditorHeight();
			}
		});

		this.notebookObservables.removeNote.subscribe((remove) => {
			if (remove !== '' && remove === this.noteId) {
				this.noteTitle = 'Smart Student';
				this.opened = false;
			}
		});

		this.notebookObservables.removeNotebook.subscribe((id) => {
			if (this.notebookID === id && id !== '') {
				this.noteTitle = 'Smart Student';
				this.opened = false;
			}
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
		this.noteId = noteId;

		this.notebookTitle = notebookTitle;

		this.tags = tags;

		this.noteTitle = title;

		this.noteDescription = description;

		this.doneLoading = false;

		this.opened = false;

		if (noteId !== '') {
			this.notebookObservables.setLoadEditor(
				notebookId,
				noteId,
				title,
				notebookTitle,
				description,
				tags
			);
		}

		this.setEditorHeight();

		this.getNotebook(notebookId);
	}

	/**
	 * Delete a notebook
	 */
	removeNote() {
		this.notesService
			.removeNote(this.notebookID, this.noteId)
			.subscribe((removed: any) => {
				if (removed) {
					this.notebookObservables.setRemoveNote(this.noteId);
					this.noteTitle = 'Smart Student';
					this.opened = false;
					this.removeNoteCard(this.noteId);

					this.notebookObservables.setLoadEditor(
						'',
						'',
						'',
						'',
						'',
						[]
					);
				}
			});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	removeNoteCard(_id: string) {}

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
	}

	setEditorHeight() {
		const vh = window.innerHeight;

		if (window.innerWidth >= 960) {
			const height =
				document.getElementById('noteInfoAccordion').offsetHeight;

			this.notebookObservables.setEditorHeight(vh - (height + 100));
		} else if (
			this.platform.ANDROID === true ||
			this.platform.IOS === true
		) {
			const height =
				document.getElementById('smallNoteHeader').offsetHeight;
			this.notebookObservables.setEditorHeight(vh - (height + 50));
		} else {
			const height =
				document.getElementById('smallNoteHeader').offsetHeight;
			this.notebookObservables.setEditorHeight(vh - (height + 110));
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

	/**
	 * Update the tags on the backend
	 */
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

	removeCollaborator(userId: string, accessId: string) {
		console.log(userId, accessId);
		this.notebookOperations
			.removeCollaborator(accessId, this.notebookID)
			.subscribe((result: boolean) => {
				if (result) {
					this.collaborators = this.collaborators.filter(
						(collaborator) => collaborator.id !== userId
					);
				}
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
