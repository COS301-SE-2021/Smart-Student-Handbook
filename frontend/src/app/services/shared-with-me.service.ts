import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SharedWithMeService {
	public notebook: BehaviorSubject<any>;

	public notebookState: Observable<any>;

	constructor() {
		this.notebook = new BehaviorSubject<any>({
			id: '',
			name: '',
		});

		this.notebookState = this.notebook.asObservable();
	}

	get getIds(): any {
		return this.notebook.value;
	}

	setNotebook(notebookID: string, notebookTitle: string) {
		this.notebook.next({
			id: notebookID,
			name: notebookTitle,
		});

		this.notebookState = this.notebook.asObservable();

		// console.log('CHANGED');
	}
}
