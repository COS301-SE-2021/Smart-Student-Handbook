import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {
	NotebookObservablesService,
	NotebookOperationsService,
} from '@app/services';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
	/** Notebook select */
	filteredOptions!: Observable<any[]>;

	myControl = new FormControl();

	form: FormGroup;

	options: CloneNotebooks[] = [];

	user: any;

	title: string;

	description: string;

	notebookId: string = '';

	constructor(
		private notebookService: NotebookOperationsService,
		private notebookObservables: NotebookObservablesService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	async ngOnInit(): Promise<void> {
		this.user = JSON.parse(<string>localStorage.getItem('user'));

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
		// console.log(this.user);
		this.notebookService
			.createNewNotebook({
				author: this.user.displayName,
				institution: this.user.institution,
				creatorId: this.user.uid,
				tags: [],
			})
			.subscribe((res: any) => {
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
			});
	}
}
