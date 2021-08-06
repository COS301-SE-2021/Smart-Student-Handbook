import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '@app/services';

// let addr;
// if (window.location.host.includes('localhost')) {
// 	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/';
// } else {
// 	addr = 'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/';
// }

// API URL for the account endpoint on the backend
const ACCOUNT_API = 'http://localhost:5001/';

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

	// inject serves needed
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

	set setLoginState(state: boolean) {
		this.isUserLoggedIn.next(state);
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
			`${ACCOUNT_API}account/registerUser`,
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
			`${ACCOUNT_API}account/loginUser`,
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
			`${ACCOUNT_API}account/updateUser`,
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
		return this.http.post(`${ACCOUNT_API}account/signOut`, {}, httpOptions);
	}

	/**
	 * Send a API request to the backend account endPoint to get the current Lodged in user and return the result (User Object)
	 */
	getCurrentUser(): Observable<any> {
		return this.http.get(`${ACCOUNT_API}account/getCurrentUser`, {
			responseType: 'json',
		});
	}

	/**
	 * Send a API request to the backend account endPoint to Delete the current Lodged in user
	 */
	// deleteUser(EmailAddress: string, Password: string): Observable<any> {
	deleteUser(): Observable<any> {
		return this.http.delete(`${ACCOUNT_API}deleteUser`, {
			responseType: 'json',
		});
	}

	setUserSessionLocalStorage(): void {
		this.getCurrentUser().subscribe(
			(data) => {
				localStorage.setItem('user', JSON.stringify(data));
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
			},
			(err) => {
				console.log(err.error.message);
			}
		);
	}
}
