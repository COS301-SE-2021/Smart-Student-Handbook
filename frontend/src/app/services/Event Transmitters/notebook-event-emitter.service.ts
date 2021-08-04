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

	LoadEditor(id: string) {
		this.loadEmitter.emit(id);
	}

	GetNoteTitle(title: string) {
		this.getTitleEmitter.emit(title);
	}
}
