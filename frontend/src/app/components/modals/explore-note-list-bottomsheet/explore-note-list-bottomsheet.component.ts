import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-explore-note-list-bottomsheet',
	templateUrl: './explore-note-list-bottomsheet.component.html',
	styleUrls: ['./explore-note-list-bottomsheet.component.scss'],
})
export class ExploreNoteListBottomsheetComponent implements OnInit {
	title: string = '';

	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit(): void {
		this.title = this.data.title;
	}
}
