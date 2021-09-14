import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ExploreObservablesService {
	/** id of notebook to be opened on explore page */
	public openExploreNotebookId: BehaviorSubject<any>;

	public openExploreNotebookIdState: Observable<any>;

	/** Open read only note */
	public openExploreViewNote: BehaviorSubject<any>;

	constructor() {
		/** id of notebook to be opened if one is selected from tree view */
		this.openExploreNotebookId = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
			readonly: true,
		});

		this.openExploreNotebookIdState =
			this.openExploreNotebookId.asObservable();

		/** Open read only note */
		this.openExploreViewNote = new BehaviorSubject<any>({
			noteId: '',
			title: '',
		});
	}

	/**
	 * Set the id an title of the notebook to be opened on the explore page
	 * @param notebookID
	 * @param title
	 * @param readonly
	 */
	setOpenExploreNotebook(
		notebookID: string,
		title: string,
		readonly: boolean
	) {
		this.openExploreNotebookId.next({
			notebookId: notebookID,
			title,
			readonly,
		});

		this.openExploreNotebookIdState =
			this.openExploreNotebookId.asObservable();
	}

	/** Open read only note */
	setOpenExploreViewNote(noteId: string, title: string) {
		this.openExploreViewNote = new BehaviorSubject<any>({
			noteId,
			title,
		});
	}
}
