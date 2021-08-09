import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
	providedIn: 'root',
})
export class NotebookEventEmitterService {
	loadEmitter = new EventEmitter();

	getTitleEmitter = new EventEmitter();

	subsVar: Subscription | undefined;

	// constructor() {}

	LoadEditor(id: string, title: string) {
		this.loadEmitter.emit({ id, title });
	}

	GetNoteTitle(title: string) {
		this.getTitleEmitter.emit(title);
	}
}
