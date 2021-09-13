/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Collaborators, Tag } from '@app/components';
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
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

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
		accessId: '',
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
		private accountService: AccountService,
		private exploreObservables: ExploreObservablesService
	) {}

	ngOnInit(): void {
		// console.log(this.bottomData);
		this.isCompleted = false;
		this.loadReadonly(this.data.noteId, this.data.title);
		this.user = this.data.user;

		this.exploreObservables.setOpenExploreViewNote(
			this.data.noteId,
			this.data.title
		);
		this.isCompleted = true;
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
		this.noteOperations.getUserNotebooks().subscribe((options: any) => {
			// console.log(options);

			this.noteOperations.cloneNote(options).subscribe((newNoteId) => {
				this.isCompleted = false;

				const dbRefObject = firebase
					.database()
					.ref(`notes/${this.noteId}`);

				dbRefObject.once('value', async (snap) => {
					const changes = snap.val();

					await firebase
						.database()
						.ref(`notes/${newNoteId}`)
						.set(changes);

					this.isCompleted = true;
				});
			});
		});
	}
}
