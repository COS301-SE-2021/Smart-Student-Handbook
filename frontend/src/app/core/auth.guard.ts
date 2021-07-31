import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		route: ActivatedRouteSnapshot,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const user = localStorage.getItem('user');
		const userProfile = localStorage.getItem('userProfile');
		if (user !== null && userProfile !== null) {
			return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate(['/account/login'], {
			queryParams: { returnUrl: state.url },
		});
		return false;
	}
}
