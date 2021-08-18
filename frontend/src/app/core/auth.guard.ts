import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '@app/services';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private accountService: AccountService
	) {}

	canActivate(): boolean {
		if (this.accountService.getLoginState) {
			return true;
		}
		this.router.navigate(['account/login']);
		return false;
	}
}
