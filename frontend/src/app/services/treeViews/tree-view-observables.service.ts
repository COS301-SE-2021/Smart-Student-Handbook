import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TreeViewObservablesService {
	public openMyNotes: BehaviorSubject<any>;

	public openSharedWithMe: BehaviorSubject<any>;

	constructor() {
		this.openMyNotes = new BehaviorSubject<any>(false);
		this.openSharedWithMe = new BehaviorSubject<any>(false);
	}

	setOpenMyNotes() {
		this.openMyNotes.next(true);
	}

	setSharedWithMe() {
		this.openSharedWithMe.next(true);
	}
}
