import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-smart-assist-panel',
	templateUrl: './smart-assist-panel.component.html',
	styleUrls: ['./smart-assist-panel.component.scss'],
})
export class SmartAssistPanelComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	/**
	 * Enlarge the recommendation card and make it scrollable
	 * @param index the index of the card to enlarge
	 */
	showPreview(index: number) {
		const snippet = document.getElementsByClassName('snippetCard')[index]
			.children[0] as HTMLElement;

		if (snippet.style.maxHeight == '400px') {
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
				col.style.width = 'fit-content';
			}
		} else {
			sideNav.style.width = '100%';

			if (col) {
				col.style.width = '25%';
			}
		}
	}
}
