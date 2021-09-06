import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '@app/services';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const jwtHelper = new JwtHelperService();

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const authToken = JSON.parse(<string>localStorage.getItem('authToken'));

		if (authToken) {
			// const decodedToken = jwtHelper.decodeToken(authToken);
			// const expirationDate = jwtHelper.getTokenExpirationDate(authToken);
			const isExpired = jwtHelper.isTokenExpired(authToken);
			if (!isExpired) {
				if (this.accountService.getLoginState) {
					// eslint-disable-next-line no-param-reassign
					request = request.clone({
						setHeaders: {
							token: `${authToken}`,
						},
					});
				}
			} else {
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

		return next.handle(request);
	}
}
