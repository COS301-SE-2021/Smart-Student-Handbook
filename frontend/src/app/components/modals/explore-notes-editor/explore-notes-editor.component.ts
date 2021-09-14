/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { Component, Inject, OnInit } from '@angular/core';
import firebase from 'firebase';
import { Tag } from '@app/components';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
	AccountService,
	NotebookService,
	NoteOperationsService,
} from '@app/services';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

@Component({
	selector: 'app-explore-notes',
	templateUrl: './explore-notes-editor.component.html',
	styleUrls: ['./explore-notes-editor.component.scss'],
})
export class ExploreNotesEditorComponent implements OnInit {
	tags: Tag[] = [];

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	user: any;

	isCompleted: boolean = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private notebookService: NotebookService,
		private noteOperations: NoteOperationsService,
		private accountService: AccountService,
		private exploreObservables: ExploreObservablesService
	) {}

	ngOnInit(): void {
		this.isCompleted = false;
		this.loadReadonly(this.data.noteId, this.data.title);

		this.noteId = this.data.noteId;
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
		// console.log(noteId);
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.noteTitle = title;
		this.noteId = noteId;
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
				const dbRefObject = firebase
					.database()
					.ref(`notes/${this.noteId}`);

				dbRefObject.once('value', async (snap) => {
					const changes = snap.val();

					await firebase
						.database()
						.ref(`notes/${newNoteId}`)
						.set(changes);
				});
			});
		});
	}
}
