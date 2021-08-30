import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-smart-assist-panel',
	templateUrl: './smart-assist-panel.component.html',
	styleUrls: ['./smart-assist-panel.component.scss'],
})
export class SmartAssistPanelComponent implements OnInit {
	// constructor() {}

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}

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
