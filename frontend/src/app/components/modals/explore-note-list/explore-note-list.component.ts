import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-explore-note-list',
	templateUrl: './explore-note-list.component.html',
	styleUrls: ['./explore-note-list.component.scss'],
})
export class ExploreNoteListComponent implements OnInit {
	title: string = '';

	description: string = '';

	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit(): void {
		this.title = this.data.title;
		this.description = this.data.description;
	}
}
