import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	AccountService,
	NotebookObservablesService,
	NotebookService,
	NoteOperationsService,
} from '@app/services';
import {
	ExploreNotesEditorBottomSheetComponent,
	ExploreNotesEditorComponent,
} from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';
import { SmartAssistObservablesService } from '@app/services/smartAssist/smart-assist-observables.service';
import { not } from 'rxjs/internal-compatibility';

@Component({
	selector: 'app-note-cards',
	templateUrl: './note-cards.component.html',
	styleUrls: ['./note-cards.component.scss'],
})
export class NoteCardsComponent implements OnInit {
	colours = [
		{
			colour: 'linear-gradient(to bottom right, rgb(233, 97, 124), rgb(231, 7, 52))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(134, 172, 173), rgb(8, 193, 199))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(133, 173, 133), rgb(71, 218, 71))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(253, 210, 130), rgb(255, 174, 24))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(202, 117, 117), rgb(190, 49, 49))',
		},
		{
			colour: 'linear-gradient(to bottom right, rgb(133, 133, 255), rgb(72, 72, 255))',
		},
	];

	tags: string[];

	// Variable that holds the logged in user details
	user: any;

	notes: any = [];

	notebookId: string = '';

	notebookTitle: string = '';

	readonly: boolean = false;

	isCompleted: boolean = true;

	creatorId: string = '';

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private bottomSheet: MatBottomSheet,
		private notesService: NoteOperationsService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService,
		private accountService: AccountService,
		private smartAssistObservables: SmartAssistObservablesService
	) {}

	ngOnInit(): void {
		this.notes = [];

		// get userDetails;
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		// if notes are displayed from the explore page
		this.exploreObservables.openExploreNotebookId.subscribe((notebook) => {
			this.readonly = notebook.readonly;

			if (notebook.notebookId !== '') {
				this.isCompleted = false;

				this.notebookId = notebook.notebookId;
				this.notebookTitle = notebook.title;
				this.getUserNotebooks();
			}
		});

		this.notebookService
			.getNotebook(this.notebookId)
			.subscribe((notebook) => {
				this.creatorId = notebook.creatorId;
			});
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks() {
		this.notes = [];

		if (this.notebookId !== null) {
			this.notebookService
				.getNotes(this.notebookId) // this.user.uid
				.subscribe(
					(result) => {
						this.notes = [];

						for (let i = 0; i < result.length; i += 1) {
							this.notes.push(result[i]);
						}
						this.isCompleted = true;
					},
					() => {
						this.isCompleted = true;
					}
				);
		} else {
			this.isCompleted = true;
		}
	}

	async openNote(
		noteId: string,
		title: string,
		description: string,
		tags: string[]
	) {
		await this.router.navigate(['notebook']);

		this.notebookObservables.setLoadEditor(
			this.notebookId,
			noteId,
			title,
			this.notebookTitle,
			description,
			tags
		);
		// this.smartAssistObservables.setSmartAssistNotebookId(this.notebookId);
		// this.smartAssistObservables.setSmartAssistNoteId(noteId);
	}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 * @param title
	 * @param description
	 * @param tags
	 */
	editNote(id: string, title: string, description: string, tags: string[]) {
		this.notesService
			.editNote(
				this.notebookId,
				id,
				title,
				description,
				this.creatorId,
				tags
			)
			.subscribe((data) => {
				if (data) {
					this.notes = this.notes.map((note: any) => {
						const temp = note;
						if (temp.noteId === id) {
							temp.description = data.description;
							temp.name = data.title;
						}

						return temp;
					});
				}
			});
	}

	deleteNote(id: string) {
		this.notesService
			.removeNote(this.notebookId, id)
			.subscribe((removed) => {
				if (removed) {
					this.notes = this.notes.filter((notebook: any) => {
						if (notebook.noteId !== id) {
							return notebook;
						}
						return null;
					});
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

	openNoteModal(noteId: string, title: string) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(ExploreNotesEditorBottomSheetComponent, {
				data: {
					title,
					noteId,
					user: this.user,
				},
			});
		} else {
			this.dialog.open(ExploreNotesEditorComponent, {
				width: '100%',
				height: '80%',
				data: {
					title,
					noteId,
					user: this.user,
				},
			});
		}
	}

	/**
	 * substring the description of a note on a small screen
	 * @param description
	 */
	substringSmallDescription(description: string) {
		if (description.length >= 50) {
			return `${description
				.substring(0, 100)
				.substring(
					0,
					description.substring(0, 50).lastIndexOf(' ')
				)}...`;
		}
		return description;
	}

	/**
	 * substring the description of a note on a medium screen
	 * @param description
	 */
	substringMediumDescription(description: string) {
		if (description.length >= 100) {
			return `${description
				.substring(0, 100)
				.substring(
					0,
					description.substring(0, 100).lastIndexOf(' ')
				)}...`;
		}
		return description;
	}

	substringLargeDescription(description: string) {
		if (description.length >= 140) {
			return `${description
				.substring(0, 140)
				.substring(
					0,
					description.substring(0, 140).lastIndexOf(' ')
				)}...`;
		}
		return description;
	}
}
