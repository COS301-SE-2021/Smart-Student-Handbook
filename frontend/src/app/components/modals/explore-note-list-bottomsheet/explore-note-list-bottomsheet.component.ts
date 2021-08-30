import { Component, Inject, OnInit } from '@angular/core';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-explore-note-list-bottomsheet',
	templateUrl: './explore-note-list-bottomsheet.component.html',
	styleUrls: ['./explore-note-list-bottomsheet.component.scss'],
})
export class ExploreNoteListBottomsheetComponent implements OnInit {
	title: string = '';

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<ExploreNoteListBottomsheetComponent>
	) {}

	ngOnInit(): void {
		this.title = this.data.title;
	}

	closeSheet(event: MouseEvent): void {
		this.bottomSheetRef.dismiss();
		event.preventDefault();
	}
}
