/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, Inject, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Collaborators, Tag } from '@app/components';
import { AddTagsTool } from '@app/components/AddTagsTool/AddTagsTool';
import firebase from 'firebase';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
	AccountService,
	NotebookService,
	NoteOperationsService,
} from '@app/services';

@Component({
	selector: 'app-explore-notes-bottom-sheet',
	templateUrl: './explore-notes-editor-bottom-sheet.component.html',
	styleUrls: ['./explore-notes-editor-bottom-sheet.component.scss'],
})
export class ExploreNotesEditorBottomSheetComponent implements OnInit {
	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

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
		private bottomSheetRef: MatBottomSheetRef<ExploreNotesEditorBottomSheetComponent>,
		private notebookService: NotebookService,
		private noteOperations: NoteOperationsService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		// console.log(this.bottomData);
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
	}

	/**
	 * Close this bottom sheet
	 * @param event
	 */
	closeSheet(event: MouseEvent): void {
		this.bottomSheetRef.dismiss();
		event.preventDefault();
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
				// SAVE NOTE INFO TO CLONED NOTE
			});
		});
	}
}
