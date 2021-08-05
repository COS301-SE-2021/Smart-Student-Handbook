import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotebookDto } from '@app/models';

let addr;
if (window.location.host.includes('localhost')) {
	addr = 'http://localhost:5001/smartstudentnotebook/us-central1/app/';
} else {
	addr = 'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/';
}

const NOTEBOOK_API = addr;

@Injectable({
	providedIn: 'root',
})
export class NotebookService {
	constructor(private httpClient: HttpClient) {}

	// getUserNotebooks(userId: string): Observable<any> {
	getUserNotebooks(): Observable<any> {
		return this.httpClient.request<any>(
			'get',
			`${NOTEBOOK_API}notebook/findAllUserNotebooks/`
		);
	}

	getNoteBookById(noteBookId: string): Observable<any> {
		return this.httpClient.request<any>(
			'get',
			`${NOTEBOOK_API}notebook/findNotebookById/${noteBookId}`
		);
	}

	createNotebook(notebookDto: NotebookDto) {
		return this.httpClient.request<any>(
			'post',
			`${NOTEBOOK_API}notebook/createNotebook/`,
			{
				body: notebookDto,
			}
		);
	}

	updateNotebook(notebookDto: NotebookDto, Id: string) {
		return this.httpClient.request<any>(
			'put',
			`${NOTEBOOK_API}notebook/updateNotebook/${Id}`,
			{
				body: notebookDto,
			}
		);
	}

	removeNotebook(noteBookId: string) {
		return this.httpClient.request<any>(
			'delete',
			`${NOTEBOOK_API}notebook/deleteNotebook/${noteBookId}`
		);
	}
}
