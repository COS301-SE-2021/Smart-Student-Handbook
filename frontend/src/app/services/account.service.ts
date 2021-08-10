import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '@app/services';
import { map } from 'rxjs/operators';

// API URL for the account endpoint on the backend
let addr;
if (window.location.host.includes('localhost')) {
	addr =
		'http://localhost:5001/smartstudentnotebook/us-central1/app/account/';
} else {
	addr =
		'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/account/';
}

const ACCOUNT_API = addr;

// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private isUserLoggedIn: BehaviorSubject<boolean>;

	public userLoggedInState: Observable<boolean>;

	constructor(
		private http: HttpClient,
		private router: Router,
		private profileService: ProfileService
	) {
		const loginState = localStorage.getItem('loginState');
		if (loginState != null) {
			this.isUserLoggedIn = new BehaviorSubject<boolean>(
				JSON.parse(loginState)
			);
		} else {
			this.isUserLoggedIn = new BehaviorSubject<boolean>(false);
		}
		this.userLoggedInState = this.isUserLoggedIn.asObservable();
	}

	get getLoginState(): boolean {
		return this.isUserLoggedIn.value;
	}

	/**
	 * Send a API request to the backend account endPoint to register a user and return the result (User Object)
	 * @param email
	 * @param phoneNumber
	 * @param displayName
	 * @param password
	 * @param passwordConfirm
	 */
	registerUser(
		email: string,
		phoneNumber: string,
		displayName: string,
		password: string,
		passwordConfirm: string
	): Observable<any> {
		return this.http.post(
			`${ACCOUNT_API}registerUser`,
			{
				email,
				phoneNumber,
				displayName,
				password,
				passwordConfirm,
			},
			httpOptions
		);
	}

	/**
	 * Send a API request to the backend account endPoint to login a user and return the result (User Object)
	 * @param email
	 * @param password
	 */
	loginUser(email: string, password: string): Observable<any> {
		return this.http
			.post(
				`${ACCOUNT_API}loginUser`,
				{
					email,
					password,
				},
				httpOptions
			)
			.pipe(
				map((user: any) => {
					if (user.success) {
						localStorage.setItem('loginState', 'true');
						localStorage.setItem('user', JSON.stringify(user.user));
						this.isUserLoggedIn.next(true);
					} else {
						localStorage.setItem('loginState', 'false');
						localStorage.removeItem('user');
						this.isUserLoggedIn.next(false);
					}

					return user;
				})
			);
	}

	/**
	 * Send a API request to the backend account endPoint to update a user and return the result (User Object)
	 * @param email
	 * @param phoneNumber
	 * @param displayName
	 * @param password
	 * @param passwordConfirm
	 */
	updateUser(
		email: string,
		phoneNumber: string,
		displayName: string,
		password: string,
		passwordConfirm: string
	): Observable<any> {
		return this.http.put(
			`${ACCOUNT_API}updateUser`,
			{
				email,
				phoneNumber,
				displayName,
				password,
				passwordConfirm,
			},
			httpOptions
		);
	}

	/**
	 * Send a API request to the backend account endPoint to Sign out the current signed in in user
	 */
	singOut(): Observable<any> {
		return this.http.post(`${ACCOUNT_API}signOut`, {}, httpOptions).pipe(
			map((x) => {
				localStorage.clear();
				this.isUserLoggedIn.next(false);
				return x;
			})
		);
	}

	/**
	 * Send a API request to the backend account endPoint to get the current Lodged in user and return the result (User Object)
	 */
	getCurrentUser(): Observable<any> {
		return this.http.get(`${ACCOUNT_API}getCurrentUser`, {
			responseType: 'json',
		});
	}

	/**
	 * Send a API request to the backend account endPoint to Delete the current Lodged in user
	 * @param EmailAddress
	 * @param Password
	 */
	// deleteUser(EmailAddress: string, Password: string): Observable<any> {
	deleteUser(): Observable<any> {
		return this.http.delete(`${ACCOUNT_API}deleteUser`, {
			responseType: 'json',
		});
	}
}
