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

	/**
	 * Inside the constructor it is first checked if the LoginState localstorage has been set and if so then set the behavioral subject
	 *  keep it persistent as other wise it will reset every time the user refreshes the page
	 * @param http
	 * @param router
	 * @param profileService
	 */
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
	 * If Register was successful then set the appropriate localstorage and Login Sate and return the user object
	 * @param email
	 * @param phoneNumber
	 * @param displayName
	 * @param password
	 * @param passwordConfirm
	 */
	registerUser(
		email: string,
		username: string,
		password: string,
		passwordConfirm: string,
		isLocalhost: boolean
	): Observable<any> {
		return this.http.post(
			`${ACCOUNT_API}registerUser`,
			{
				email,
				username,
				password,
				passwordConfirm,
				isLocalhost,
			},
			httpOptions
		);
	}

	/**
	 * Send a API request to the backend account endPoint to login a user
	 * If the login request was successful a success of true will be returned with the user object
	 * If the login was successful all the appropriate localstorage values and behavioral subject sate will be updated
	 * Before the user object is returned
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
	 * Send a API request to the backend profile endPoint to update a user profile
	 * User only has to enter information that they want to, its not required
	 * @param uid - required parameter
	 * @param name - optional
	 * @param institution - optional
	 * @param department - optional
	 * @param program - optional
	 * @param workStatus - optional
	 * @param bio - optional
	 * @param profilePicUrl - optional
	 *
	 */
	updateUser(
		uid: string,
		name?: string,
		institution?: string,
		department?: string,
		program?: string,
		workStatus?: string,
		bio?: string,
		profilePicUrl?: string
	): Observable<any> {
		return this.http.post(
			`${ACCOUNT_API}updateUser`,
			{
				uid,
				name,
				institution,
				department,
				program,
				workStatus,
				bio,
				profilePicUrl,
			},
			httpOptions
		);
	}
	// TODO after updateUser call the getCurrentUser to update the LocalStorage with the new users information

	/**
	 * Send a API request to the backend account endPoint to Sign out the current signed in in user
	 * Clear all the LocalStorage values that store the user information and loginState
	 * Update the isUserLoggedIn Behavioural subject to false to indicate the user is no longer logged in
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
	 * Update the Localstorage user object when user is returned
	 */
	getCurrentUser(): Observable<any> {
		return this.http
			.get(`${ACCOUNT_API}getCurrentUser`, {
				responseType: 'json',
			})
			.pipe(
				map((user: any) => {
					if (user.success) {
						localStorage.setItem('user', JSON.stringify(user.user));
					}
					return user.user;
				})
			);
	}

	/**
	 * Send a API request to the backend account endPoint to Delete the current Lodged in user
	 * Delete all the LocalStorage Data of the user and set their LoginSate to false
	 * Return the user to the Login Page
	 * @param EmailAddress
	 * @param Password
	 */
	// deleteUser(EmailAddress: string, Password: string): Observable<any> {
	deleteUser(): Observable<any> {
		return this.http
			.delete(`${ACCOUNT_API}deleteUser`, {
				responseType: 'json',
			})
			.pipe(
				map((x) => {
					localStorage.clear();
					this.isUserLoggedIn.next(false);
					this.router.navigate(['account/login']);
					return x;
				})
			);
	}
}
