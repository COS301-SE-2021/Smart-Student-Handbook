import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// API URL for the account endpoint on the backend
let addr;
if (window.location.host.includes('localhost')) {
	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/account';
} else {
	addr =
		'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/account';
}

const RESETPASSWORD_API = addr;
// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class ResetPasswordService {
	constructor(private http: HttpClient) {}

	/**
	 * Request to send a reset password email
	 * @param userId
	 * @param email
	 * @param isLocalhost
	 */
	requestResetPassword(
		userId: string,
		email: string,
		isLocalhost: boolean
	): Observable<any> {
		return this.http.post(
			`${RESETPASSWORD_API}/requestResetPassword`,
			{ email, isLocalhost, userId },
			httpOptions
		);
	}

	finalizeResetPassword(
		userId: string,
		email: string,
		isLocalhost: boolean,
		newPassword: string,
		code: string
	): Observable<any> {
		return this.http.post(
			`${RESETPASSWORD_API}/finalizeResetPassword`,
			{ email, isLocalhost, newPassword, code, userId },
			httpOptions
		);
	}
}
