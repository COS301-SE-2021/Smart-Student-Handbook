import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
	intercept(
		httpRequest: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const API_KEY = '123456';
		return next.handle(httpRequest.clone({ setHeaders: { API_KEY } }));
	}
}
