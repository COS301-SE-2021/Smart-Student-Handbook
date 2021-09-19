import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-chat-bottom-sheet',
	templateUrl: './chat-bottom-sheet.component.html',
	styleUrls: ['./chat-bottom-sheet.component.scss'],
})
export class ChatBottomSheetComponent {
	constructor(
		private bottomSheetRef: MatBottomSheetRef<ChatBottomSheetComponent>
	) {}

	/**
	 * Close this bottom sheet
	 * @param event
	 */
	closeSheet(event: MouseEvent): void {
		this.bottomSheetRef.dismiss();
		event.preventDefault();
	}
}
