import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Collaborators } from '@app/components';
import { NotebookOperationsService } from '@app/services';
import { MatChipInputEvent } from '@angular/material/chips';
import { Tag } from '@app/mobile';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-note-info',
	templateUrl: './note-info.component.html',
	styleUrls: ['./note-info.component.scss'],
})
export class NoteInfoComponent implements OnInit {
	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	collaborators: Collaborators[] = [];

	creator: Collaborators = {
		name: '',
		url: '',
		id: '',
	};

	date: string = '';

	tags: Tag[] = [];

	notebookId: string = '';

	noteId: string = '';

	title: string = '';

	notebook: any;

	user: any;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private notebookOperations: NotebookOperationsService
	) {}

	ngOnInit(): void {
		this.user = this.data.user;
		this.notebookId = this.data.notebookID;
		this.noteId = this.data.noteId;
		this.title = this.data.notebookTitle;
		this.date = this.data.date;
		this.notebook = this.data.notebook;
		this.tags = this.data.tags;
		this.collaborators = this.data.collaborators;
		this.creator = this.data.creator;
	}

	/**
	 * Insert new tags to the input and tags array
	 * @param event To get the value from the newly inserted tag
	 */
	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.tags.push({ name: value });
		}

		// Clear the input value
		event.chipInput!.clear();

		this.updateTags();
	}

	/**
	 * Remove a tag from input and tags array
	 * @param tag the tag to be removed
	 */
	removeTag(tag: Tag): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}

		this.updateTags();
	}

	updateTags() {
		const tagList: string[] = [];
		for (let i = 0; i < this.tags.length; i += 1) {
			tagList.push(this.tags[i].name);
		}

		this.notebookOperations
			.updateNotebookTags({
				title: this.notebook.title,
				author: this.notebook.author,
				course: this.notebook.course,
				description: this.notebook.description,
				institution: this.notebook.institution,
				creatorId: this.notebook.creatorId,
				private: this.notebook.private,
				tags: tagList,
				notebookId: this.notebook.notebookId,
			})
			.subscribe(() => {});
	}

	addCollaborator() {
		this.notebookOperations
			.requestCollaborator(this.user.uid, this.notebookId, '')
			.subscribe(() => {
				// collaborator: any
				// this.collaborators.push(collaborator);
			});
	}

	removeCollaborator(userId: string) {
		this.notebookOperations
			.removeCollaborator(userId, this.notebookId)
			.subscribe((id: string) => {
				this.collaborators = this.collaborators.filter(
					(collaborator) => collaborator.id !== id
				);
			});
	}
}