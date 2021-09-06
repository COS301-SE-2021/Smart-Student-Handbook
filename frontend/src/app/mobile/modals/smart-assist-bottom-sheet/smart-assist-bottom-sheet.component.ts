import { Component, Inject } from '@angular/core';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-smart-assist-bottom-sheet',
	templateUrl: './smart-assist-bottom-sheet.component.html',
	styleUrls: ['./smart-assist-bottom-sheet.component.scss'],
})
export class SmartAssistBottomSheetComponent {
	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private bottomSheetRef: MatBottomSheetRef<SmartAssistBottomSheetComponent>
	) {}

	closeSheet() {
		this.bottomSheetRef.dismiss();
	}
}
