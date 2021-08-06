import { Component } from '@angular/core';
import { AccountService } from '@app/services';
import { Router } from '@angular/router';

@Component({
	selector: 'app-rest-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	constructor(
		private router: Router,
		private accountService: AccountService
	) {
		// redirect to home if already logged in
		// if (this.accountService.getLoginState) {
		// 	this.router.navigate(['/home']);
		// }
	}
}
