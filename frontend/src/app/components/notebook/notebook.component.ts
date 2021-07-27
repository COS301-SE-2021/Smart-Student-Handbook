import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ThemePalette } from '@angular/material/core'

import EditorJS from '@editorjs/editorjs'
import { ActivatedRoute, Router } from '@angular/router'
import { NotebookService } from '../../services/notebook.service'

import { AddNotebookComponent } from '../modals/add-notebook/add-notebook.component'
import { GlobalConfirmComponent } from '../modals/global/global-confirm/global-confirm.component'
import { AccountService } from '../../services/account.service'
import { ProfileService } from '../../services/profile.service'
import { FolderPanelComponent } from '../panels/folder-panel/folder-panel.component'
import { NotesPanelComponent } from '../panels/notes-panel/notes-panel.component'
import { ConfirmDeleteComponent } from '../modals/confirm-delete/confirm-delete.component'
import { EditorComponent } from '../editor/editor.component'

@Component({
	selector: 'app-notebook',
	templateUrl: './notebook.component.html',
	styleUrls: ['./notebook.component.scss'],
})
export class NotebookComponent implements OnInit {
	// Variables for add notebook popup dialog
	title = ''

	course = ''

	description = ''

	institution = ''

	private = false

	notebookTitle = 'New Notebook'

	// public editorData = '<p>Hello, world!</p>';

	links = ['First']

	activeLink = this.links[0]

	background: ThemePalette = undefined

	notebookID: string = ''

	_editor!: EditorJS

	// Variable that holds the logged in user details
	user: any

	profile: any

	@ViewChild('folderPanelComponent')
	folderPanelComponent!: FolderPanelComponent

	@ViewChild('notePanelComponent') notePanelComponent!: NotesPanelComponent

	@ViewChild('editorComponent') editorComponent!: EditorComponent

	/**
	 * Include the notebook service
	 * @param notebookService
	 */
	constructor(
		private _router: Router,
		private accountService: AccountService
	) {}

	ngOnInit() {
		this.accountService.isUserLoggedIn()

		// Assign "openPanel function to the eventhandler from folder panel to open the note panel when the view is loaded"
		document.addEventListener('DOMContentLoaded', (event) => {
			this.folderPanelComponent.openNotebookPanel = () => {
				this.notePanelComponent.openedCloseToggle()
			}

			this.notePanelComponent.openNotebook = (id: string) => {
				this.editorComponent.loadEditor(id)
			}
		})

		// let userDeatils;
		this.user = JSON.parse(<string>localStorage.getItem('user'))
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'))
		this.profile = this.profile.userInfo
	}

	// Open (and close) the notes panel
	openPanel() {
		console.log(this.notePanelComponent)
		this.notePanelComponent.openedCloseToggle()
	}

	async logout() {
		this.accountService.singOut().subscribe(
			(data) => {
				this._router.navigateByUrl(`/login`)
				localStorage.clear()
			},
			(err) => {
				console.log(`Error: ${err.error.message}`)
			}
		)
	}
}
