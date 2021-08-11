import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {
	NotebookService,
	NotebookEventEmitterService,
	NotesService,
} from '@app/services';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
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

	// Variable that holds the logged in user details
	user: any;

	notes: any = [];

	notebookId: string = '';

	constructor(
		private router: Router,
		private notesService: NotesService,
		private notebookService: NotebookService,
		private notebookEventEmitterService: NotebookEventEmitterService
	) {}

	ngOnInit(): void {
		// get userDetails;
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.getUserNotebooks();
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	async getUserNotebooks() {
		const loader = document.getElementById('mobileOverlay') as HTMLElement;

		const notebookId = localStorage.getItem('notebookId');

		if (notebookId) this.notebookId = notebookId;

		this.notes = [];

		if (notebookId !== null) {
			this.notebookService
				.getNotes(notebookId) // this.user.uid
				.subscribe((result) => {
					for (let i = 0; i < result.length; i += 1) {
						// console.log(result[i]);
						this.notes.push(result[i]);
					}
					loader.style.display = 'none';
				});
		}
	}

	async openNote(noteId: string, title: string) {
		await this.router.navigate(['notebook']);

		// setTimeout(() => {
		//   this.notebook.loadEditor(id);
		// }, 2000)
		this.notebookEventEmitterService.LoadEditor(
			this.notebookId,
			noteId,
			title
		);
	}

	createNewNotebook() {
		this.notesService.createNewNote(this.notebookId).subscribe((data) => {
			console.log(data);
			this.openNote(data.id, data.notebook.name);
			// data = id, notebook
		});
	}

	/**
	 * Edit the details of a notebook
	 * @param id the id of the notebook to be updated
	 */
	editNote(id: string) {
		this.notesService
			.editNotebook(this.notebookId, id)
			.subscribe((data) => {
				if (data) {
					this.notes = this.notes.map((note: any) => {
						if (note.noteId === id) {
							note.description = data.description;
							note.name = data.title;
						}

						return note;
					});
				}
			});
	}

	deleteNote(id: string) {
		console.log(this.notebookId, id);
		this.notesService
			.removeNote(this.notebookId, id)
			.subscribe((removed) => {
				if (removed) {
					this.notes = this.notes.filter((notebook: any) => {
						if (notebook.noteId !== id) {
							return notebook;
						}
					});
				}
			});
	}
}
