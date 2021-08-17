import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotebookDataService {
	public ids: BehaviorSubject<any>;

	public idState: Observable<any>;

	constructor() {
		this.ids = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
		});

		this.idState = this.ids.asObservable();
	}

	get getIds(): any {
		return this.ids.value;
	}

	setID(notebookID: string, noteID: string) {
		this.ids.next({
			notebookId: notebookID,
			title: noteID,
		});

		this.idState = this.ids.asObservable();

		console.log('CHANGED');
	}
}
