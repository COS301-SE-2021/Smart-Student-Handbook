import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
	providedIn: 'root',
})
export class NotebookEventEmitterService {
	loadEmitter = new EventEmitter();

	closeNoteEmitter = new EventEmitter();

	changePrivacyEmitter = new EventEmitter();

	loadInfoEmitter = new EventEmitter();

	getTitleEmitter = new EventEmitter();

	subsVar: Subscription | undefined;

	// constructor() {}

	LoadEditor(notebookId: string, noteId: string, title: string) {
		this.loadEmitter.emit({ notebookId, noteId, title });
	}

	GetNoteTitle(title: string) {
		this.getTitleEmitter.emit(title);
	}

	CloseNote() {
		this.closeNoteEmitter.emit();
	}

	ChangePrivacy(privacy: boolean) {
		this.changePrivacyEmitter.emit(privacy);
	}
}
