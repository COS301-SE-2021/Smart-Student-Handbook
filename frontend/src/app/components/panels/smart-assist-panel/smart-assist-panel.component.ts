import { Component, OnInit } from '@angular/core';
import { SmartAssistObservablesService } from '@app/services/smartAssist/smart-assist-observables.service';

@Component({
	selector: 'app-smart-assist-panel',
	templateUrl: './smart-assist-panel.component.html',
	styleUrls: ['./smart-assist-panel.component.scss'],
})
export class SmartAssistPanelComponent implements OnInit {
	notebookId: string;

	noteId: string;

	constructor(
		private smartAssistObservables: SmartAssistObservablesService
	) {}

	ngOnInit(): void {
		this.smartAssistObservables.smartAssistNotebookId.subscribe(
			({ notebookId }) => {
				if (
					notebookId !== undefined &&
					notebookId !== this.notebookId
				) {
					this.notebookId = notebookId;

					console.log(notebookId);
				}
			}
		);

		this.smartAssistObservables.smartAssistNoteId.subscribe(
			({ noteId }) => {
				if (noteId !== undefined && noteId !== this.noteId) {
					this.noteId = noteId;

					console.log(noteId);
				}
			}
		);
	}

	/**
	 * Show and hide (open and close) the panel
	 */
	openedCloseToggle() {
		const sideNav = document.getElementById(
			'smartAssistContainer'
		) as HTMLElement;
		const col = sideNav?.parentElement?.parentElement;

		if (sideNav.style.width === '100%') {
			sideNav.style.width = '40px';

			if (col) {
				col.style.width = '40px';
				col.style.minWidth = '0px';
			}
		} else {
			sideNav.style.width = '100%';

			if (col) {
				col.style.width = '25%';
			}
		}
	}
}
