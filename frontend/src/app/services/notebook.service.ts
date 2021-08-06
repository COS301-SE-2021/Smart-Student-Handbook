import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotebookDto } from '@app/models';

// let addr;
// if (window.location.host.includes('localhost')) {
// 	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/';
// } else {
// 	addr = 'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/';
// }

// API URL for the account endpoint on the backend
const NOTEBOOK_API = 'http://localhost:5001/';

// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class NotebookService {
	constructor(private httpClient: HttpClient) {}

	// getUserNotebooks(userId: string): Observable<any> {
	getUserNotebooks(): Observable<any> {
		return this.httpClient.get(
			`${NOTEBOOK_API}notebook/findAllUserNotebooks/`,
			httpOptions
		);
	}

	getNoteBookById(noteBookId: string): Observable<any> {
		return this.httpClient.get(
			`${NOTEBOOK_API}notebook/findNotebookById/${noteBookId}`,
			httpOptions
		);
	}

	createNotebook(notebookDto: NotebookDto) {
		return this.httpClient.post(
			`${NOTEBOOK_API}notebook/createNotebook/`,
			{
				body: notebookDto,
			},
			httpOptions
		);
	}

	updateNotebook(notebookDto: NotebookDto, Id: string) {
		return this.httpClient.put(
			`${NOTEBOOK_API}notebook/updateNotebook/${Id}`,
			{
				body: notebookDto,
			},
			httpOptions
		);
	}

	removeNotebook(noteBookId: string) {
		return this.httpClient.delete(
			`${NOTEBOOK_API}notebook/deleteNotebook/${noteBookId}`,
			httpOptions
		);
	}
}
