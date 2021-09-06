import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '@app/services';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private accountService: AccountService
	) {}

	canActivate(): boolean {
		const user = this.accountService.getUserValue;
		const authToken = JSON.parse(<string>localStorage.getItem('authToken'));
		let isExpired = true;

		if (authToken) {
			isExpired = jwtHelper.isTokenExpired(authToken);
			if (isExpired) {
				// TODO refresh the token here
				this.accountService.singOut().subscribe(
					() => {
						this.router.navigate(['account/login']);
					},
					(err) => {
						console.log(`Error: ${err.error.message}`);
					}
				);
			}
		}

		if (this.accountService.getLoginState && user && !isExpired) {
			return true;
		}
		this.router.navigate(['account/login']);
		return false;
	}
}
