import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NotebookObservablesService {
	/** id of notebook to be opened if one is selected from tree view */
	public openNotebookId: BehaviorSubject<any>;

	/** Load a note on the editor */
	public loadEditor: BehaviorSubject<any>;

	/** Name and id of the notebook to add to shared-with-me tree view when collaboration request is accepted */
	public sharedNotebook: BehaviorSubject<any>;

	/** Name and id of the notebook to add to my notebooks tree view when a note is cloned */
	public clonedNotebook: BehaviorSubject<any>;

	/** close a note on the editor */
	public closeEditor: BehaviorSubject<any>;

	/** Change the privacy of a notebook */
	public notebookPrivacy: BehaviorSubject<any>;

	/** close the note panel */
	public closePanel: BehaviorSubject<any>;

	/** id of notebook to review */
	public reviewNotebook: BehaviorSubject<any>;

	/** Set the height of the editor */
	public editorHeight: BehaviorSubject<any>;

	/** Contents to be drag and dropped */
	public dragAndDrop: BehaviorSubject<any>;

	/** Note has been deleted */
	public removeNote: BehaviorSubject<any>;

	public removeNotebook: BehaviorSubject<any>;

	constructor() {
		/** id of notebook to be opened if one is selected from tree view */
		this.openNotebookId = new BehaviorSubject<any>({
			notebookId: '',
			title: '',
			readonly: true,
		});

		/** notebookId, noteId and title of note to be opened in the editor */
		this.loadEditor = new BehaviorSubject<any>({
			notebookId: '',
			noteId: '',
			title: '',
			notebookTitle: '',
			description: '',
			tags: [],
		});

		/** Name and id of the notebook to add to shared-with-me tree view when collaboration request is accepted */
		this.sharedNotebook = new BehaviorSubject<any>({
			id: '',
			name: '',
		});

		/** Name and id of the notebook to add to my notebooks tree view when a note is cloned */
		this.clonedNotebook = new BehaviorSubject<any>({
			id: '',
			name: '',
		});

		/** Close the note open on the editor */
		this.closeEditor = new BehaviorSubject<any>({
			close: false,
		});

		/** Change the privacy of a notebook */
		this.notebookPrivacy = new BehaviorSubject<any>({
			private: false,
		});

		/** Close the notes panel */
		this.closePanel = new BehaviorSubject<any>({
			close: false,
		});

		/** id of notebook to review */
		this.reviewNotebook = new BehaviorSubject<any>({
			id: '',
		});

		/** Set the height of the editor */
		const vh = window.innerHeight;
		this.editorHeight = new BehaviorSubject<any>({
			height: vh - 200,
		});

		/** Set the content to be inserted into the note */
		this.dragAndDrop = new BehaviorSubject<any>({
			content: [],
		});

		/** Set the content to be inserted into the note */
		this.removeNote = new BehaviorSubject<any>('');

		this.removeNotebook = new BehaviorSubject<any>('');
	}

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
	}

	/**
	 * Set the notebookId, noteId, title, and notebookTitle that the editor will use to open a note
	 * @param notebookId
	 * @param noteId
	 * @param title
	 * @param notebookTitle
	 * @param description
	 * @param tags
	 */
	setLoadEditor(
		notebookId: string,
		noteId: string,
		title: string,
		notebookTitle: string,
		description: string,
		tags: string[]
	) {
		this.loadEditor.next({
			notebookId,
			noteId,
			title,
			notebookTitle,
			description,
			tags,
		});
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
	}

	/**
	 * Set the name and id of the notebook to be added to the my notebooks list
	 * @param notebookID
	 * @param notebookTitle
	 */
	setClonedNotebook(notebookID: string, notebookTitle: string) {
		this.clonedNotebook.next({
			id: notebookID,
			name: notebookTitle,
		});
	}

	/**
	 * Set the notebookId, noteId, title, and notebookTitle that the editor will use to open a note
	 * @param close
	 */
	setCloseEditor(close: boolean) {
		this.closeEditor.next({
			close,
		});
	}

	/**
	 * Set the privacy of a notebook
	 * @param privacy
	 */
	setNotebookPrivacy(privacy: boolean) {
		this.notebookPrivacy.next({
			private: privacy,
		});
	}

	/**
	 * Close the notes panel
	 * @param close
	 */
	setClosePanel(close: boolean) {
		this.closePanel.next({
			close,
		});
	}

	/**
	 * id of notebook to review
	 * @param id
	 */
	setReviewNotebook(id: string) {
		this.reviewNotebook.next({
			id,
		});
	}

	/** Set the height of the editor */
	setEditorHeight(height: number) {
		this.editorHeight.next({
			height,
		});
	}

	/** Set the content to be inserted into the note */
	setDragAndDrop(content: any[]) {
		this.dragAndDrop.next({
			content,
		});
	}

	/** Note has been deleted */
	setRemoveNote(id: string) {
		this.removeNote.next(id);
	}

	/** Note has been deleted */
	setRemoveNotebook(id: string) {
		this.removeNotebook.next(id);
	}
}
