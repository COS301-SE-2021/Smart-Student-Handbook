import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
	constructor(
		private router: Router // private accountService: AccountService
	) {
		// redirect to home if already logged in
		const user = localStorage.getItem('user');
		const userProfile = localStorage.getItem('userProfile');
		if (user !== null && userProfile !== null) {
			this.router.navigate(['/']);
		}
	}
}
