import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
	providedIn: 'root',
})
export class NotebookEventEmitterService {
	loadEmitter = new EventEmitter();

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
}
