import { Component, OnInit } from '@angular/core';
import { SmartAssistObservablesService } from '@app/services/smartAssist/smart-assist-observables.service';
import { SmartAssistService } from '@app/services/smart-assist.service';
import firebase from 'firebase';
import 'firebase/firestore';
import { NotebookObservablesService } from '@app/services';
import { query } from '@angular/animations';

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
export class SmartAssistComponent implements OnInit {
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

	constructor(
		private notebookObservables: NotebookObservablesService,
		private smartAssistObservables: SmartAssistObservablesService,
		private smartAssistService: SmartAssistService
	) {}

	ngOnInit(): void {
		this.draggable = true;
		if (window.innerWidth < 960) {
			this.draggable = false;
		}

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

					console.log(notebookId);
				}
			}
		);

		this.smartAssistObservables.smartAssistNoteId.subscribe(
			async ({ noteId }) => {
				if (noteId !== undefined && noteId !== this.noteId) {
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
					console.log(noteId);
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

	addToNote() {
		const content = [
			{
				insert: 'Functional Requirements',
			},
			{
				insert: ' R1:The system should allow users to manage their Profile and Account.',
			},
			{
				insert: 'R2:The system should allow users to create notes and add content to it then add appropriate tags to their content.',
			},
		];

		this.notebookObservables.setDragAndDrop(content);

		console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
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

		console.log(notedata);

		this.notes = [];

		this.smartAssistService
			.getRecommendations(notedata)
			.subscribe(async (recs) => {
				console.log(recs);
				const ids: string[] = recs.data;
				console.log(ids);

				await firebase
					.firestore()
					.collection('userNotes')
					.where('noteId', 'in', ids)
					.get()
					.then((queryResult) => {
						queryResult.forEach(async (doc) => {
							console.log(doc.id);

							const temp: noteType = {
								noteId: doc.id,

								title: doc.data().name,

								date: new Date(
									doc.data().createdDate
								).toDateString(),

								tags: doc.data().tags,

								blocks: undefined,
							};

							await firebase
								.database()
								.ref(`notes/${doc.id}`)
								.get()
								.then((docdata) => {
									temp.blocks = docdata.val().changes;
								});
							console.log(temp);
							this.notes.push(temp);
						});
					});

				console.log(this.notes);
			});
	}
}
