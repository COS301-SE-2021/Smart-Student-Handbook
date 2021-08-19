import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '@app/services';
import { onMainContentChange } from '@app/styling/animations';

@Component({
	selector: 'app-secure-layout',
	templateUrl: './secure-layout.component.html',
	styleUrls: ['./secure-layout.component.scss'],
	animations: [onMainContentChange],
})
export class SecureLayoutComponent {
	@ViewChild('sidenav') sidenav: MatSidenav | undefined;

	title = 'smart-student';

	message: any;

	public onSideNavChange: boolean | undefined;

	constructor(
		// private messagingService: MessagingService,
		private sidenavService: SideNavService
	) {
		this.sidenavService.sideNavState$.subscribe((res) => {
			this.onSideNavChange = res;
		});
	}
}
