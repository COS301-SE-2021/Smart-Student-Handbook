import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SmartAssistDto } from '@app/models/smart-assist/smart-assist.model';
import { Observable } from 'rxjs';

// API URL for the account endpoint on the backend
let addr;
if (window.location.host.includes('localhost')) {
	addr =
		'http://localhost:5001/smartstudentnotebook/us-central1/app/recommendations';
} else {
	addr =
		'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/recommendations';
}

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class SmartAssistService {
	constructor(private httpClient: HttpClient, private router: Router) {}

	getRecommendations(smartAssistDto: SmartAssistDto): Observable<any> {
		return this.httpClient.post(
			`${addr}/getRecommendations`,
			{
				name: smartAssistDto.name,
				tags: smartAssistDto.tags,
				author: smartAssistDto.author,
				institution: smartAssistDto.institution,
				course: smartAssistDto.course,
			},
			httpOptions
		);
	}
}
