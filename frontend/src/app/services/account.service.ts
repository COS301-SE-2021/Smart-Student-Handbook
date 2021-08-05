import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

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
	// inject serves needed
	constructor(
		private http: HttpClient,
		private router: Router,
		private profileService: ProfileService
	) {}

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
		return this.http.post(
			`${ACCOUNT_API}loginUser`,
			{
				email,
				password,
			},
			httpOptions
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
		return this.http.post(`${ACCOUNT_API}signOut`, {}, httpOptions);
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

	/**
	 * check if user is logged in
	 * if already logged in redirect them to the notebook page
	 * if the user is not logged in redirect them to the login page
	 * every time the function runs update the local storage with most up to date information
	 */
	async isUserLoggedIn(): Promise<void> {
		const curentRoute = this.router.url.split('?')[0];

		// TODO first check if the user value has been set in the localstorage...

		// Get the current Lodged in userDetails, if fail then user is not logged in
		this.getCurrentUser().subscribe(
			(data) => {
				// update the LocalStorage for "user" and "userProfile"
				this.profileService.getUserDetails(data.uid).subscribe(
					(user) => {
						localStorage.setItem(
							'userProfile',
							JSON.stringify(user)
						);
					},
					(err) => {
						console.log(`Error: ${err.error.message}`);
					}
				);

				localStorage.setItem('user', JSON.stringify(data));

				// if the user is logged in and they are not in the login, register or forgot password then take them to the notebook page
				if (
					curentRoute === '/' ||
					curentRoute === '/login' ||
					curentRoute === '/register' ||
					curentRoute === '/forgotPassword'
				) {
					this.router.navigateByUrl(`/notebook`);
				}
			},
			(err) => {
				console.log(err.error.message);
				// if the user is not logged in allow them to navigate login, register and forgotPassword
				if (
					curentRoute !== '/' &&
					curentRoute !== '/login' &&
					curentRoute !== '/register' &&
					curentRoute !== '/forgotPassword'
				) {
					this.router.navigateByUrl(`/login`);
				}
			}
		);
	}
}
