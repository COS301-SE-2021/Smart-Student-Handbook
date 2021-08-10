import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotebookDto } from '@app/models';
import { NoteDto } from '@app/models/notebook/NoteDto.model';
import { CheckAccessDto } from '@app/models/notebook/CheckAccessDto.model';
import { ReviewDto } from '../../../../functions/src/notebook/dto/review.dto';
import { AccessDto } from '../../../../functions/src/notebook/dto/access.dto';

let addr;
if (window.location.host.includes('localhost')) {
	addr =
		'http://localhost:5001/smartstudentnotebook/us-central1/app/notebook';
} else {
	addr =
		'https://us-central1-smartstudentnotebook.cloudfunctions.net/app/notebook';
}

const NOTEBOOK_API = addr;

// Shared header options for API request
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class NotebookService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Create a notebook with the following variables
	 * @param notebookDto
	 * param title
	 * param author
	 * param course
	 * param description
	 * param institution
	 * param creatorId
	 * param private
	 * param tags
	 */
	createNotebook(notebookDto: NotebookDto): Observable<any> {
		return this.httpClient.post(
			`${NOTEBOOK_API}/createNotebook`,
			{
				title: notebookDto.title,
				author: notebookDto.author,
				course: notebookDto.course,
				description: notebookDto.description,
				institution: notebookDto.institution,
				creatorId: notebookDto.creatorId,
				private: notebookDto.private,
				tags: notebookDto.tags,
			},
			httpOptions
		);
	}

	/**
	 * Update a notebook with the following variables
	 * @param notebookDto
	 * param title
	 * param author
	 * param course
	 * param description
	 * param institution
	 * param creatorId
	 * param private
	 * param tags
	 */
	updateNotebook(notebookDto: NotebookDto): Observable<any> {
		return this.httpClient.put(
			`${NOTEBOOK_API}/updateNote`,
			{
				title: notebookDto.title,
				author: notebookDto.author,
				course: notebookDto.course,
				description: notebookDto.description,
				institution: notebookDto.institution,
				creatorId: notebookDto.creatorId,
				private: notebookDto.private,
				tags: notebookDto.tags,
			},
			httpOptions
		);
	}

	/**
	 * Get all the user's notebooks and note id's
	 */
	getUserNotebooks(): Observable<any> {
		return this.httpClient.get(
			`http://localhost:5001/smartstudentnotebook/us-central1/app/notebook/getUserNotebooks`,
			httpOptions
		);
	}

	/**
	 * Get all notes inside a notebook
	 * @param notebookID
	 */
	getNotes(notebookID: string): Observable<any> {
		return this.httpClient.get(
			`${NOTEBOOK_API}/getNotes/${notebookID}`,
			httpOptions
		);
	}

	/**
	 * Create a new note with following parameters:
	 * @param noteDto
	 * Notebook id
	 * Notebook name
	 */
	createNote(noteDto: NoteDto): Observable<any> {
		return this.httpClient.post(`${NOTEBOOK_API}/createNote`, {
			notebookId: noteDto.notebookId,
			name: noteDto.name,
			description: noteDto.description,
		});
	}

	/**
	 * Update a notebook's name
	 * @param noteDto
	 * notebook id
	 * note id
	 * name
	 */
	updateNote(noteDto: NoteDto): Observable<any> {
		return this.httpClient.put(`${NOTEBOOK_API}/updateNote`, {
			notebookId: noteDto.notebookId,
			noteId: noteDto.noteId,
			name: noteDto.name,
			description: noteDto.description,
		});
	}

	/**
	 * Delete a whole notebook
	 * @param notebookID
	 */
	deleteNotebook(notebookID: string): Observable<any> {
		return this.httpClient.delete(
			`${NOTEBOOK_API}/deleteNotebook/${notebookID}`,
			httpOptions
		);
	}

	/**
	 * Delete a note
	 * @param notebookId
	 * @param noteId
	 */
	deleteNote(notebookId: string, noteId: string): Observable<any> {
		return this.httpClient.delete(
			`${NOTEBOOK_API}/deleteNote/${notebookId}/${noteId}`
		);
	}

	/**
	 * Add a review to a notebook
	 * @param reviewDto
	 * notebookId
	 * message
	 * rating
	 * displayName
	 * userId
	 * profileUrl
	 */
	addNotebookReview(reviewDto: ReviewDto): Observable<any> {
		return this.httpClient.post(
			`${NOTEBOOK_API}/addNotebookReview`,
			{
				notebookId: reviewDto.notebookId,
				message: reviewDto.message,
				rating: reviewDto.rating,
				displayName: reviewDto.displayName,
				userId: reviewDto.userId,
				profileUrl: reviewDto.profileUrl,
			},
			httpOptions
		);
	}

	/**
	 * Retrieve the reviews of a notebook
	 * @param notebookId
	 */
	getNotebookReviews(notebookId: string): Observable<any> {
		return this.httpClient.get(
			`${NOTEBOOK_API}/getNotebookReviews/${notebookId}`,
			httpOptions
		);
	}

	/**
	 * Delete a notebook review
	 * @param notebookId
	 */
	deleteNotebookReview(notebookId: string): Observable<any> {
		return this.httpClient.delete(
			`${NOTEBOOK_API}/deleteNotebookReview/${notebookId}`,
			httpOptions
		);
	}

	/**
	 * Give a user access to a notebook
	 * @param accessDto
	 * displayName
	 * userId
	 * profileUrl
	 * notebookId
	 */
	addAccess(accessDto: AccessDto): Observable<any> {
		return this.httpClient.post(
			`${NOTEBOOK_API}/addAccess`,
			{
				displayName: accessDto.displayName,
				userId: accessDto.userId,
				profileUrl: accessDto.profileUrl,
				notebookId: accessDto.notebookId,
			},
			httpOptions
		);
	}

	/**
	 * Check if a user has access to a notebook
	 * @param checkAccessDto
	 * userId
	 * notebookId
	 */
	checkUserAccess(checkAccessDto: CheckAccessDto): Observable<any> {
		return this.httpClient.get(
			`${NOTEBOOK_API}/checkUserAccess/${checkAccessDto.userId}/${checkAccessDto.notebookId}`
		);
	}

	/**
	 * Remove a user's access to a notebook
	 * @param checkAccessDto
	 * userId
	 * notebookId
	 */
	removeUserAccess(checkAccessDto: CheckAccessDto): Observable<any> {
		return this.httpClient.delete(
			`${NOTEBOOK_API}/removeUserAccess/${checkAccessDto.userId}/${checkAccessDto.notebookId}`
		);
	}
}
