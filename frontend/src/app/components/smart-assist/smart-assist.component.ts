import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-smart-assist',
	templateUrl: './smart-assist.component.html',
	styleUrls: ['./smart-assist.component.scss'],
})
export class SmartAssistComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

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
}
