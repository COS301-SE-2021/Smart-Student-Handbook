import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotebookObservablesService {
	/** id of notebook to be opened if one is selected from tree view */
	public openNotebookId: BehaviorSubject<any>;

	public openNotebookIdState: Observable<any>;

	/** Name and id of the notebook to add to shared-with-me tree view when collaboration request is accepted */
	public sharedNotebook: BehaviorSubject<any>;

	public sharedNotebookState: Observable<any>;

	constructor() {
		/** id of notebook to be opened if one is selected from tree view */
		this.openNotebookId = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
		});

		this.openNotebookIdState = this.openNotebookId.asObservable();

		/** Name and id of the notebook to add to shared-with-me tree view when collaboration request is accepted */
		this.sharedNotebook = new BehaviorSubject<any>({
			id: '',
			name: '',
		});

		this.sharedNotebookState = this.sharedNotebook.asObservable();
	}

	/** @return id & title of the notebook to be opened */
	get getOpenNotebookIds(): any {
		return this.openNotebookId.value;
	}

	/**
	 * Set the id an title of the notebook to be opened
	 * @param notebookID
	 * @param title
	 */
	setOpenNotebook(notebookID: string, title: string) {
		this.openNotebookId.next({
			notebookId: notebookID,
			title,
		});

		this.openNotebookIdState = this.openNotebookId.asObservable();
	}

	/** @return name & id of the new notebook to be added to the shared-with-me tree view */
	get getNewSharedWithMe(): any {
		return this.sharedNotebook.value;
	}

	/**
	 * Set the name and id of the notebook to be added to the shared-with-me notebook list
	 * as well as the notebook to be loaded when a user clicks on a notebook in the menu tree views
	 * @param notebookID
	 * @param notebookTitle
	 */
	setNotebook(notebookID: string, notebookTitle: string) {
		this.sharedNotebook.next({
			id: notebookID,
			name: notebookTitle,
		});

		this.sharedNotebookState = this.sharedNotebook.asObservable();
	}
}
