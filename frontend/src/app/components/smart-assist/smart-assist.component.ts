import { Component, OnDestroy, OnInit } from '@angular/core';
import { SmartAssistObservablesService } from '@app/services/smartAssist/smart-assist-observables.service';
import { SmartAssistService } from '@app/services/smart-assist.service';
import firebase from 'firebase';
import 'firebase/firestore';
import { NotebookObservablesService } from '@app/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RateNotebookComponent } from '@app/components';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface noteType {
	noteId: string;
	date: string;
	title: string;
	blocks: blockType;
	tags: string[];
}
// eslint-disable-next-line @typescript-eslint/naming-convention
interface blockType {
	ops: { insert: string[] }[];
}

@Component({
	selector: 'app-smart-assist',
	templateUrl: './smart-assist.component.html',
	styleUrls: ['./smart-assist.component.scss'],
})
export class SmartAssistComponent implements OnInit, OnDestroy {
	draggable: boolean = true;

	notebookId: string = '';

	noteId: string = '';

	name: string = '';

	tags: string[] = [];

	author: string = '';

	institution: string = '';

	course: string = '';

	notes: noteType[] = [];

	date: string = '';

	loading: boolean = false;

	smartAssistNoteSubscription: any;

	smartAssistNotebookSubscription: any;

	constructor(
		private notebookObservables: NotebookObservablesService,
		private smartAssistObservables: SmartAssistObservablesService,
		private smartAssistService: SmartAssistService,
		private snackBar: MatSnackBar,
		private bottomSheet: MatBottomSheet,
		private dialog: MatDialog
	) {}

	ngOnDestroy(): void {
		if (this.smartAssistNoteSubscription)
			this.smartAssistNoteSubscription.unsubscribe();
		if (this.smartAssistNotebookSubscription)
			this.smartAssistNotebookSubscription.unsubscribe();
	}

	ngOnInit(): void {
		this.draggable = window.innerWidth >= 960;

		this.smartAssistNotebookSubscription =
			this.smartAssistObservables.smartAssistNotebookId.subscribe(
				({ notebookId }) => {
					if (
						notebookId !== undefined &&
						notebookId !== this.notebookId &&
						notebookId !== ''
					) {
						this.notebookId = notebookId;

						firebase
							.firestore()
							.collection('userNotebooks')
							.doc(notebookId)
							.get()
							.then((docdata) => {
								this.author = docdata.data().author;
								this.institution = docdata.data().institution;
								this.course = docdata.data().course;
							});

						// console.log(notebookId);
					}
				}
			);

		this.smartAssistNoteSubscription =
			this.smartAssistObservables.smartAssistNoteId.subscribe(
				async ({ noteId }) => {
					if (
						noteId !== undefined &&
						noteId !== this.noteId &&
						noteId !== ''
					) {
						this.noteId = noteId;

						await firebase
							.firestore()
							.collection('userNotes')
							.doc(noteId)
							.get()
							.then((docdata) => {
								this.name = docdata.data().name;
								this.tags = docdata.data().tags;

								const unixdate = docdata.data().createdDate;
								this.date = new Date(
									unixdate * 1000
								).toDateString();
							});

						this.loadRecommendations(
							this.name,
							this.tags,
							this.author,
							this.institution,
							this.course
						);
						// console.log(noteId);
					}
				}
			);
	}

	/**
	 * Enlarge the recommendation card and make it scrollable
	 * @param index the index of the card to enlarge
	 */
	showPreview(index: number) {
		const snippet = document.getElementsByClassName('snippetCard')[index]
			.children[0] as HTMLElement;

		if (snippet.style.maxHeight === '400px') {
			this.hidePreview(index);
		} else {
			snippet.style.maxHeight = '400px';
			snippet.style.overflowY = 'scroll';
		}
	}

	/**
	 * Hide the preview of the recommendation card
	 * @param index the index of the card to hide
	 */
	hidePreview(index: number) {
		const snippet = document.getElementsByClassName('snippetCard')[index]
			.children[0] as HTMLElement;

		snippet.style.maxHeight = '200px';
		snippet.style.overflow = 'hidden';
	}

	async addToNote(recNoteId: string) {
		let content = [];

		await firebase
			.database()
			.ref(`notes/${recNoteId}`)
			.get()
			.then((docdata) => {
				content = docdata.val().changes.ops;
			});

		this.notebookObservables.setDragAndDrop(content);

		this.snackBar.open('Snippet successfully added', '', {
			duration: 2000,
		});
	}

	loadRecommendations(name, tags, author, institution, course) {
		if (tags === undefined) {
			// eslint-disable-next-line no-param-reassign
			tags = [];
		}

		const notedata = {
			name,
			tags,
			author,
			institution,
			course,
		};

		// console.log(notedata);

		this.notes = [];

		this.loading = true;

		this.smartAssistService.getRecommendations(notedata).subscribe(
			async (recs) => {
				if (recs) {
					const ids: string[] = recs.data;
					// console.log(recs);

					await firebase
						.firestore()
						.collection('userNotes')
						.where('noteId', 'in', ids)
						.get()
						.then((queryResult) => {
							queryResult.forEach(async (doc) => {
								const temp: noteType = {
									noteId: doc.id,

									title: doc.data().name,

									date: new Date(
										doc.data().createdDate
									).toDateString(),

									tags: doc.data().tags,

									blocks: undefined,
								};

								// console.log(temp);

								await firebase
									.database()
									.ref(`notes/${doc.id}`)
									.get()
									.then((docdata) => {
										if (docdata.val()) {
											temp.blocks = docdata.val().changes;
										}
									});

								if (temp.blocks) this.notes.push(temp);

								this.loading = false;
							});

							// console.log('DONE LOADING SMART ASSIST');
						});

					// console.log(this.notes);
				} else {
					this.loading = false;
				}
			},
			() => {
				this.loading = false;
			}
		);
	}

	openReviews(noteId: string) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(RateNotebookComponent);
		} else {
			this.dialog.open(RateNotebookComponent);
		}
		this.notebookObservables.setReviewNotebook(noteId, 'note');
	}
}
