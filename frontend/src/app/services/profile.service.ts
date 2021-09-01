import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// API URL for the account endpoint on the backend
let addr;
if (window.location.host.includes('localhost')) {
	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/user/';
} else {
	addr =
		'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/user/';
}

const PROFILE_API = addr;
// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	constructor(private http: HttpClient, private router: Router) {}

	/**
	 * Send a API request to the backend profile endPoint to get a users profile information
	 * @param userId
	 */
	getUserByUid(userId: string): Observable<any> {
		return this.http.get(`${PROFILE_API}getUserByUid/${userId}`, {
			headers: { 'Content-Type': 'application/json' },
			responseType: 'json',
		});
	}

	/**
	 * Returns the appropriate user information of the user with the username equal to the username passed in
	 * @param username
	 */
	getUserByUsername(username: string): Observable<any> {
		return this.http.post(
			`${PROFILE_API}getUserByUsername`,
			{ username },
			httpOptions
		);
	}
}
