import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import EditorJS from '@editorjs/editorjs';
import { Router } from '@angular/router';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { NotebookEventEmitterService, AccountService } from '@app/services';
import { LeftMenuComponent } from '@app/core';
import {
	NotesPanelComponent,
	EditorComponent,
	TreeViewComponent,
} from '@app/components';
import { OpenNotebookPanelService } from '@app/services/Event Transmitters/open-notebook-panel.service';

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

	profile: any;

	@ViewChild('notePanelComponent') notePanelComponent!: NotesPanelComponent;

	@ViewChild('editorComponent') editorComponent!: EditorComponent;

	@ViewChild('treeComponent') treeComponent!: TreeViewComponent;

	@ViewChild('overlay') overlay!: HTMLDivElement;

	@ViewChild('mobileTitle') mobileTitle!: HTMLSpanElement;

	/**
	 * Include the notebook service
	 * @param router
	 * @param accountService
	 * @param notebookEventEmitterService
	 */
	constructor(
		private router: Router,
		private accountService: AccountService,
		private notebookEventEmitterService: NotebookEventEmitterService,
		private openNotebookPanelService: OpenNotebookPanelService
	) {}

	/**
	 * When the view is loaded:
	 *  let the menuPanelComponent openNotebookPanel method call the notePanelComponent's openedCloseToggle method
	 *  let the notePanelComponent openNotebook method call the editor component's load editor method
	 *  let the editorComponent removeNotebookCard method call the notePanelComponent's removeNotebook method
	 */
	ngOnInit() {
		// get userDeatils;
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
		this.profile = this.profile.userInfo;

		// Open a note when one is selected from the mobile view and update the title
		if (this.notebookEventEmitterService.subsVar === undefined) {
			this.notebookEventEmitterService.subsVar =
				this.notebookEventEmitterService.loadEmitter.subscribe(
					(id: string) => {
						this.loadEditor(id);
					}
				);
			// this.notebookEventEmitterService.getTitleEmitter.subscribe(
			// 	(title: string) => {
			// 		const noteTitle = document.getElementById(
			// 			'mobileTitle'
			// 		) as HTMLSpanElement;
			// 		// noteTitle.innerHTML = title;
			// 	}
			// );
		}

		// Toggle the notePanelComponent when in desktop view and notebook is selected
		if (this.openNotebookPanelService.toggleSubscribe === undefined) {
			this.openNotebookPanelService.toggleSubscribe =
				this.openNotebookPanelService.togglePanelEmitter.subscribe(
					() => {
						this.notePanelComponent.openedCloseToggle();
					}
				);
		}
	}

	ngAfterViewInit() {
		// this.menuPanelComponent.treeViewComponent.openNotebookFolder = () => {
		// 	alert();
		// 	// 	this.notePanelComponent.openedCloseToggle();
		// };

		// this.treeComponent.openNotebookFolder = () => {
		// 	// this.router.navigate(['notes']);
		// 	this.notePanelComponent.openedCloseToggle();
		// };

		this.notePanelComponent.openNotebook = (id: string) => {
			this.editorComponent.loadEditor(id);
		};

		this.editorComponent.removeNotebookCard = (id: string) => {
			this.notePanelComponent.removeNotebook(id);
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

	async loadEditor(id: string) {
		await this.editorComponent.loadEditor(id);
	}
}
