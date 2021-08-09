import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
	AccountService,
	MessagingService,
	SideNavService,
} from '@app/services';
import { onMainContentChange } from '@app/styling/animations';

@Component({
	selector: 'app-secure-layout',
	templateUrl: './secure-layout.component.html',
	styleUrls: ['./secure-layout.component.scss'],
	animations: [onMainContentChange],
})
export class SecureLayoutComponent implements OnInit {
	@ViewChild('sidenav') sidenav: MatSidenav | undefined;

	isExpanded = true;

	showSubmenu: boolean = false;

	isShowing = false;

	showSubSubMenu: boolean = false;

	//--------------------------------------------------------------------------------------

	panelOpenState = false;

	title = 'smart-student';

	message: any;

	private isUserLoggedIn: boolean | undefined;

	name = 'Angular';

	public onSideNavChange: boolean | undefined; // ?????

	constructor(
		private messagingService: MessagingService,
		private accountService: AccountService,
		private sidenavService: SideNavService
	) {
		this.accountService.userLoggedInState.subscribe((state) => {
			this.isUserLoggedIn = state;
		});

		this.sidenavService.sideNavState$.subscribe((res) => {
			console.log(res);
			this.onSideNavChange = res;
		});
	}

	ngOnInit() {
		// firebase.initializeApp(environment.firebase);

		this.messagingService.requestPermission();
		this.messagingService.receiveMessage();
		this.message = this.messagingService.currentMessage;
	}
}
