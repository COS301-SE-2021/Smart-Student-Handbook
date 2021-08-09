import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
	providedIn: 'root',
})
export class OpenNotebookPanelService {
	togglePanelEmitter = new EventEmitter();

	toggleSubscribe: Subscription | undefined;

	toggleNotePanel(notebookId: string) {
		this.togglePanelEmitter.emit(notebookId);
	}
}
