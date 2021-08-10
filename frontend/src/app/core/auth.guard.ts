import { Injectable } from '@angular/core';
import {
	// ActivatedRouteSnapshot,
	CanActivate,
	Router,
	// RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '@app/services';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	// state: boolean = false;

	constructor(
		private router: Router,
		private accountService: AccountService
	) {}

	canActivate(): // route: ActivatedRouteSnapshot,// state: RouterStateSnapshot
	| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		if (this.accountService.getLoginState) {
			// authorised so return true
			return true;
		}
		// not logged in so redirect to login page with the return url
		// this.router.navigate(['/account/login'], {
		// 	queryParams: { returnUrl: state.url },
		// });
		this.router.navigate(['account/login']);
		return false;
	}
}