import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import EditorJS from '@editorjs/editorjs';
import { Router } from '@angular/router';
import { MatDrawerMode } from '@angular/material/sidenav';
import { AccountService } from '@app/services';
import {
	NotesPanelComponent,
	EditorComponent,
	TreeViewComponent,
} from '@app/components';

@Component({
	selector: 'app-notebook',
	templateUrl: './notebook.component.html',
	styleUrls: ['./notebook.component.scss'],
})
export class NotebookComponent implements OnInit, AfterViewInit {
	// Variables for add notebook popup dialog
	title = '';

	course = '';

	description = '';

	institution = '';

	private = false;

	menuMode: MatDrawerMode = 'over';

	hasBackDrop: boolean = true;

	notebookTitle = '';

	username = 'Arno';

	degree = 'Computer Science';

	// public editorData = '<p>Hello, world!</p>';

	links = ['First'];

	activeLink = this.links[0];

	background: ThemePalette = undefined;

	notebookID: string = '';

	_editor!: EditorJS;

	// Variable that holds the logged in user details
	user: any;

	@ViewChild('notePanelComponent') notePanelComponent!: NotesPanelComponent;

	@ViewChild('editorComponent') editorComponent!: EditorComponent;

	@ViewChild('treeComponent') treeComponent!: TreeViewComponent;

	@ViewChild('overlay') overlay!: HTMLDivElement;

	@ViewChild('mobileTitle') mobileTitle!: HTMLSpanElement;

	/**
	 * Include the notebook service
	 * @param router
	 * @param accountService
	 */
	constructor(
		private router: Router,
		private accountService: AccountService
	) {}

	/**
	 * When the view is loaded:
	 *  let the menuPanelComponent openNotebookPanel method call the notePanelComponent's openedCloseToggle method
	 *  let the notePanelComponent openNotebook method call the editor component's load editor method
	 *  let the editorComponent removeNotebookCard method call the notePanelComponent's removeNotebook method
	 */
	ngOnInit() {
		// get userDeatils;
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	ngAfterViewInit() {
		this.notePanelComponent.openNotebook = (
			notebookId: string,
			noteId: string,
			title: string,
			notebookTitle: string,
			description: string,
			tags: string[]
		) => {
			this.editorComponent.loadEditor(
				notebookId,
				noteId,
				title,
				notebookTitle,
				description,
				tags
			);
		};

		this.editorComponent.removeNoteCard = (id: string) => {
			this.notePanelComponent.removeNote(id);
		};
	}

	showOverlay() {
		const e = document.getElementById('overlay')!;
		e.style.display = 'block';
	}

	hideOverlay() {
		const e = document.getElementById('overlay')!;
		e.style.display = 'none';
	}

	async loadEditor(
		notebookId: string,
		noteId: string,
		title: string,
		notebookTitle: string,
		description: string,
		tags: string[]
	) {
		await this.editorComponent.loadEditor(
			notebookId,
			noteId,
			title,
			notebookTitle,
			description,
			tags
		);
	}
}
