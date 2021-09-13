import { Component, OnInit } from '@angular/core';
import { NotebookObservablesService } from '@app/services';

@Component({
	selector: 'app-smart-assist',
	templateUrl: './smart-assist.component.html',
	styleUrls: ['./smart-assist.component.scss'],
})
export class SmartAssistComponent implements OnInit {
	draggable: boolean = true;

	constructor(private notebookObservables: NotebookObservablesService) {}

	ngOnInit(): void {
		this.draggable = true;
		if (window.innerWidth < 960) {
			this.draggable = false;
		}
	}

	/**
	 * Enlarge the recommendation card and make it scrollable
	 * @param index the index of the card to enlarge
	 */
	showPreview(index: number) {
		const snippet = document.getElementsByClassName('snippetCard')[index]
			.children[0] as HTMLElement;

		if (snippet.style.maxHeight === '400px') {
			this.hidePreview(index);
		} else {
			snippet.style.maxHeight = '400px';
			snippet.style.overflowY = 'scroll';
		}
	}

	/**
	 * Hide the preview of the recommendation card
	 * @param index the index of the card to hide
	 */
	hidePreview(index: number) {
		const snippet = document.getElementsByClassName('snippetCard')[index]
			.children[0] as HTMLElement;

		snippet.style.maxHeight = '200px';
		snippet.style.overflow = 'hidden';
	}

	addToNote() {
		const content = [
			{
				insert: 'Functional Requirements',
			},
			{
				insert: ' R1:The system should allow users to manage their Profile and Account.',
			},
			{
				insert: 'R2:The system should allow users to create notes and add content to it then add appropriate tags to their content.',
			},
		];

		this.notebookObservables.setDragAndDrop(content);

		console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	}
}
