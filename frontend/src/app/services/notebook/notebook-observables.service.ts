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

	/** Load a note on the editor */
	public loadEditor: BehaviorSubject<any>;

	public loadEditorState: Observable<any>;

	/** close a note on the editor */
	public closeEditor: BehaviorSubject<any>;

	public closeEditorState: Observable<any>;

	/** Change the privacy of a notebook */
	public notebookPrivacy: BehaviorSubject<any>;

	public notebookPrivacyState: Observable<any>;

	/** close the note panel */
	public closePanel: BehaviorSubject<any>;

	public closePanelState: Observable<any>;

	/** id of notebook to be opened on explore page */
	public openExploreNotebookId: BehaviorSubject<any>;

	public openExploreNotebookIdState: Observable<any>;

	constructor() {
		/** id of notebook to be opened if one is selected from tree view */
		this.openNotebookId = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
			readonly: false,
		});

		this.openNotebookIdState = this.openNotebookId.asObservable();

		/** Name and id of the notebook to add to shared-with-me tree view when collaboration request is accepted */
		this.sharedNotebook = new BehaviorSubject<any>({
			id: '',
			name: '',
		});

		this.sharedNotebookState = this.sharedNotebook.asObservable();

		/** notebookId, noteId and title of note to be opened in the editor */
		this.loadEditor = new BehaviorSubject<any>({
			notebookId: '',
			noteId: '',
			title: '',
		});

		this.loadEditorState = this.loadEditor.asObservable();

		/** Close the note open on the editor */
		this.closeEditor = new BehaviorSubject<any>({
			close: false,
		});

		this.closeEditorState = this.closeEditor.asObservable();

		/** Change the privacy of a notebook */
		this.notebookPrivacy = new BehaviorSubject<any>({
			private: false,
		});

		this.notebookPrivacyState = this.notebookPrivacy.asObservable();

		/** Close the notes panel */
		this.closePanel = new BehaviorSubject<any>({
			close: false,
		});

		this.closePanelState = this.closePanel.asObservable();

		/** id of notebook to be opened if one is selected from tree view */
		this.openExploreNotebookId = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
		});

		this.openExploreNotebookIdState =
			this.openExploreNotebookId.asObservable();
	}

	// /** @return id & title of the notebook to be opened */
	// get getOpenNotebookIds(): any {
	// 	return this.openNotebookId.value;
	// }

	/**
	 * Set the id an title of the notebook to be opened
	 * @param notebookID
	 * @param title
	 * @param readonly
	 */
	setOpenNotebook(notebookID: string, title: string, readonly: boolean) {
		this.openNotebookId.next({
			notebookId: notebookID,
			title,
			readonly,
		});

		this.openNotebookIdState = this.openNotebookId.asObservable();
	}

	// /** @return name & id of the new notebook to be added to the shared-with-me tree view */
	// get getNewSharedWithMe(): any {
	// 	return this.sharedNotebook.value;
	// }

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

	// /** @return notebookId, noteId, title, and notebookTitle that will be used to open the note on the editor */
	// get getLoadEditor(): any {
	// 	return this.loadEditor.value;
	// }

	/**
	 * Set the notebookId, noteId, title, and notebookTitle that the editor will use to open a note
	 * @param notebookId
	 * @param noteId
	 * @param title
	 * @param readonly
	 */
	setLoadEditor(
		notebookId: string,
		noteId: string,
		title: string,
		readonly: boolean
	) {
		this.loadEditor.next({
			notebookId,
			noteId,
			title,
			readonly,
		});

		this.loadEditorState = this.loadEditor.asObservable();
	}

	// /** @return close boolean - true: close, false, don't close  */
	// get getCloseEditor(): any {
	// 	return this.closeEditor.value;
	// }

	/**
	 * Set the notebookId, noteId, title, and notebookTitle that the editor will use to open a note
	 * @param close
	 */
	setCloseEditor(close: boolean) {
		this.closeEditor.next({
			close,
		});

		this.closeEditorState = this.closeEditor.asObservable();
	}

	/**
	 * Set the privacy of a notebook
	 * @param privacy
	 */
	setNotebookPrivacy(privacy: boolean) {
		this.notebookPrivacy.next({
			private: privacy,
		});

		this.notebookPrivacyState = this.notebookPrivacy.asObservable();
	}

	/**
	 * Close the notes panel
	 * @param close
	 */
	setClosePanel(close: boolean) {
		this.closePanel.next({
			close,
		});

		this.closePanelState = this.closePanel.asObservable();
	}

	/**
	 * Set the id an title of the notebook to be opened on the explore page
	 * @param notebookID
	 * @param title
	 */
	setOpenExploreNotebook(notebookID: string, title: string) {
		this.openExploreNotebookId.next({
			notebookId: notebookID,
			title,
		});

		this.openExploreNotebookIdState =
			this.openExploreNotebookId.asObservable();
	}
}
