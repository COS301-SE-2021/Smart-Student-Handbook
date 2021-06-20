import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  constructor(private httpClient: HttpClient) { }

  getUserNotebooks(userId: string): Observable<any>{

    return this.httpClient.request<any>('get','http://localhost:5001/notebook/findAllUserNotebooks/');
  }

  getNoteBookById(noteBookId: string): Observable<any>{

    return this.httpClient.request<any>('get','http://localhost:5001/notebook/findNotebookById/' + noteBookId);
  }

  createNotebook(notebookDto: NotebookDto, userId: string){

    return this.httpClient.request<any>('post','http://localhost:5001/notebook/createNotebook/', {
      body: notebookDto
    });
  }

  removeNotebook(noteBookId: string){

    return this.httpClient.request<any>('delete','http://localhost:5001/notebook/deleteNotebook/' + noteBookId);
  }
}

class NotebookDto {
  readonly author?: string
  readonly course?: string
  readonly description?: string
  readonly institution?: string
  readonly name?: string
  readonly surname?: string
  readonly private?: boolean
  readonly username?: string
}
