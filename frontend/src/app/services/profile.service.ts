import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// API URL for the account endpoint on the backend
const PROFILE_API = 'http://localhost:5001/user/';
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
	 * Send a API request to the backend profile endPoint to create a new user profile
	 * User only has to enter information that they want to, its not required
	 * @param uid - required parameter
	 * @param name - optional
	 * @param institution - optional
	 * @param department - optional
	 * @param program - optional
	 * @param workStatus - optional
	 * @param bio - optional
	 * @param dateJoined - optional -  Must be in the correct format json object dateJoined:{"_seconds",1,"_nanoseconds":1}
	 */
	createUser(
		uid: string,
		name?: string,
		institution?: string,
		department?: string,
		program?: string,
		workStatus?: string,
		bio?: string,
		dateJoined?: string
	): Observable<any> {
		return this.http.post(
			`${PROFILE_API}createUser`,
			{
				uid,
				name,
				institution,
				department,
				program,
				workStatus,
				bio,
				dateJoined,
			},
			httpOptions
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
	 * @param dateJoined - optional -  Must be in the correct format json object dateJoined:{"_seconds",1,"_nanoseconds":1}
	 */
	updateUser(
		uid: string,
		name?: string,
		institution?: string,
		department?: string,
		program?: string,
		workStatus?: string,
		bio?: string,
		dateJoined?: string
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
				dateJoined,
			},
			httpOptions
		);
	}
}
