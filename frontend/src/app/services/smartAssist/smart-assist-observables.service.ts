import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SmartAssistObservablesService {
	/** id of notebook to be opened on smart assist */
	public smartAssistNotebookId: BehaviorSubject<any>;

	/** id of notebook to be opened on smart assist */
	public smartAssistNoteId: BehaviorSubject<any>;

	constructor() {
		/** id of notebook to be opened on smart assist panel */
		this.smartAssistNotebookId = new BehaviorSubject<any>({
			notebookId: '',
		});

		/** id of note to be opened on smart assist panel */
		this.smartAssistNoteId = new BehaviorSubject<any>({
			notebookId: '',
		});
	}

	/**
	 * Set the id of the notebook to be opened on the smart assist panel
	 * @param notebookId
	 */
	setSmartAssistNotebookId(notebookId: string) {
		this.smartAssistNotebookId.next({
			notebookId,
		});
	}

	/**
	 * Set the id of the note to be opened on the smart assist panel
	 * @param noteId
	 */
	setSmartAssistNoteId(noteId: string) {
		this.smartAssistNoteId.next({
			noteId,
		});
	}
}
