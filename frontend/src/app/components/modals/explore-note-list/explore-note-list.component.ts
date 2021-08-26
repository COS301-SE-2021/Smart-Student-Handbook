import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-explore-note-list',
	templateUrl: './explore-note-list.component.html',
	styleUrls: ['./explore-note-list.component.scss'],
})
export class ExploreNoteListComponent implements OnInit {
	title: string = '';

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ExploreNoteListComponent>
	) {}

	ngOnInit(): void {
		this.title = this.data.title;
	}

	closeSheet(event: MouseEvent): void {
		this.bottomSheetRef.dismiss();
		event.preventDefault();
	}
}
