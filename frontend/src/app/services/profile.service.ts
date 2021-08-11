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
	getUserDetails(userId: string): Observable<any> {
		return this.http.get(`${PROFILE_API}getUserDetails/${userId}`, {
			headers: { 'Content-Type': 'application/json' },
			responseType: 'json',
		});
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
			`${PROFILE_API}updateUser`,
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
}
