import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
	providedIn: 'root',
})
export class NotebookEventEmitterService {
	loadEditor = new EventEmitter();

	subsVar: Subscription | undefined;

	// constructor() {}

	LoadEditor(id: string) {
		this.loadEditor.emit(id);
	}
}
