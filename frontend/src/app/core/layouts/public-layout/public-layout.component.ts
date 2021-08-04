import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services';

@Component({
	selector: 'app-public-layout',
	templateUrl: './public-layout.component.html',
	styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent {
	constructor(
		private router: Router,
		private accountService: AccountService
	) {
		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}
	}
}
