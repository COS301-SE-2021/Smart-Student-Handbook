import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '@app/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private accountService: AccountService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// add auth header with jwt if user is logged in and request is to the api url
		// const user = this.accountService.userValue;
		// const isLoggedIn = user && user.token;

		const authToken = JSON.parse(<string>localStorage.getItem('authToken'));

		if (this.accountService.getLoginState) {
			// eslint-disable-next-line no-param-reassign
			request = request.clone({
				setHeaders: {
					token: `${authToken}`,
				},
			});
		}

		return next.handle(request);
	}
}
