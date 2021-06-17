import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  constructor(private httpClient: HttpClient) { }

  getUserNotebooks(userId: string): Observable<any>{

    return this.httpClient.request<any>('get','http://localhost:5001/notebook/findAllUserNotebooks/' + userId);
  }

  getNoteBookById(userId: string): Observable<any>{

    return this.httpClient.request<any>('get','http://localhost:5001/notebook/findNotebookById/' + userId);
  }
}
