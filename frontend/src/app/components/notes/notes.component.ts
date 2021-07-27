import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { NotebookService } from 'src/app/services/notebook.service';
import { NotebookEventEmitterService } from 'src/app/services/notebook-event-emitter.service';
import { EditorComponent } from '../editor/editor.component';
import { NotebookComponent } from '../notebook/notebook.component';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
	colours = [
		{
			top: 'rgb(233, 97, 124)',
			bottom: 'rgb(231, 7, 52)',
		},
		{
			top: 'rgb(134, 172, 173)',
			bottom: 'rgb(8, 193, 199)',
		},
		{
			top: 'rgb(133, 173, 133)',
			bottom: 'rgb(71, 218, 71)',
		},
		{
			top: 'rgb(253, 210, 130)',
			bottom: 'rgb(255, 174, 24)',
		},
		{
			top: 'rgb(202, 117, 117)',
			bottom: 'rgb(190, 49, 49)',
		},
		{
			top: 'rgb(133, 133, 255)',
			bottom: 'rgb(72, 72, 255)',
		},
	];

	// Variable that holds the logged in user details
	user: any;

	profile: any;

	notes: any = [];

	constructor(
		private router: Router,
		private notebookService: NotebookService,
		private notebookEventEmitterService: NotebookEventEmitterService
	) {}

	ngOnInit(): void {
		// get userDeatils;
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
		this.profile = this.profile.userInfo;

		this.getUserNotebooks();
	}

	/**
	 * Retrieve the logged in user's notebooks
	 */
	getUserNotebooks() {
		this.notes = [];

		this.notebookService
			.getUserNotebooks(this.user.uid)
			.subscribe((result) => {
				for (let i = 0; i < result.length; i++) {
					// console.log(result[i]);
					this.notes.push(result[i]);
				}
			});
	}

	async openNote(id: string) {
		await this.router.navigate(['notebook']);

		// setTimeout(() => {
		//   this.notebook.loadEditor(id);
		// }, 2000)
		this.notebookEventEmitterService.LoadEditor(id);
	}

	navigateBack() {
		this.router.navigate(['notebook']);
	}
}
