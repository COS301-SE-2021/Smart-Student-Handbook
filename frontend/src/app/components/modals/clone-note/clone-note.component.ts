import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {
	AccountService,
	NotebookObservablesService,
	NotebookOperationsService,
	NotebookService,
} from '@app/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CloneNotebooks {
	notebookId: string;

	title: string;
}

@Component({
	selector: 'app-clone-note',
	templateUrl: './clone-note.component.html',
	styleUrls: ['./clone-note.component.scss'],
})
export class CloneNoteComponent implements OnInit {
	tags: string[] = [];

	readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

	/** Notebook select */
	filteredOptions!: Observable<any[]>;

	myControl = new FormControl();

	form: FormGroup;

	options: CloneNotebooks[] = [];

	user: any;

	title: string;

	description: string;

	notebookId: string = '';

	isCompleted: boolean = false;

	constructor(
		private notebookOperationService: NotebookOperationsService,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private accountService: AccountService,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<CloneNoteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	async ngOnInit(): Promise<void> {
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		// console.log(this.data.options);
		this.options = this.data.options;

		// setup the form and validation
		this.form = new FormGroup({
			// notebook: new FormControl('', [Validators.required]),
			title: new FormControl('', [Validators.required]),
			description: new FormControl('', [Validators.required]),
		});

		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map((value) => this.filter(value))
		);

		this.isCompleted = true;
	}

	/**
	 * If the user types in the autocomplete, filter the results
	 * @param value
	 * @private
	 */
	private filter(value: string): CloneNotebooks[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) =>
			option.title.toLowerCase().includes(filterValue)
		);
	}

	/**
	 * If a notebook is selected, get its id
	 * @param notebookId
	 */
	selected(notebookId: string) {
		this.notebookId = notebookId;
	}

	/**
	 * Create and add a new notebook to the user's My Notebooks list
	 */
	createNewNotebook() {
		// this.isCompleted = false;

		// console.log(this.user);
		this.notebookOperationService
			.createNewNotebook({
				author: this.user.displayName,
				institution: this.user.institution,
				tags: [],
			})
			.subscribe(
				(res: any) => {
					if (res) {
						this.options.push({
							title: res.notebook.title,
							notebookId: res.notebook.notebookId,
						});

						// console.log(res);
						const notebookInput = document.getElementById(
							'notebookInput'
						) as HTMLInputElement;
						notebookInput.value = res.notebook.title;

						this.myControl.setValue(res.notebook.title);

						this.notebookId = res.notebook.notebookId;

						this.notebookObservables.setClonedNotebook(
							res.notebook.notebookId,
							res.notebook.title
						);
					}
					this.isCompleted = true;
				},
				() => {
					this.isCompleted = true;
				}
			);
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
	}

	cloneNote() {
		this.isCompleted = false;

		const request = {
			tags: this.tags,
			notebookId: this.notebookId,
			name: this.title,
			description: this.description,
		};

		this.notebookService.createNote(request).subscribe(
			(newNote) => {
				// console.log(newNote);

				if (newNote.noteId) {
					this.snackBar.open('Note successfully cloned!', '', {
						duration: 2000,
					});
					this.isCompleted = true;
					this.dialogRef.close(newNote.noteId);
				} else {
					this.isCompleted = true;
					this.dialogRef.close(false);
				}
			},
			() => {
				this.isCompleted = true;
				this.dialogRef.close(false);
			}
		);
	}
}
