import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotebookBottomSheetComponent } from '@app/mobile';
import { Collaborators, Tag, ViewProfileComponent } from '@app/components';
import EditorJS from '@editorjs/editorjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
	selector: 'app-explore-note-list',
	templateUrl: './explore-note-list.component.html',
	styleUrls: ['./explore-note-list.component.scss'],
})
export class ExploreNoteListComponent implements OnInit {
	title: string = '';

	description: string = '';

	//-----------------------------------

	Editor!: EditorJS;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	tags: Tag[] = [];

	collaborators: Collaborators[] = [];

	creator: Collaborators = {
		name: '',
		url: '',
		id: '',
	};

	date: string = '';

	notebookID: string = '';

	noteId: string = '';

	noteTitle: string = 'Smart Student';

	static staticNotebookID: string = '';

	static staticNoteId: string = '';

	static staticNotebookTitle: string = 'Smart Student';

	panelOpenState = false;

	showMore: boolean = false;

	notebook: any;

	user: any;

	private: boolean = true;

	opened: boolean = false;

	notebookTitle = '';

	doneLoading: boolean = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.title = this.data.title;
		this.description = this.data.description;
	}

	/**
	 * Show menu when user clicks on ellipsis
	 * @param event To prevent the accordion from opening and closing when ellipsis is clicked
	 */
	showMoreOptions(event: Event) {
		event.stopPropagation();
	}

	/**
	 * When the accordion is opened and closed, adjust the height of the notebook
	 */
	openClosePanel() {
		this.panelOpenState = !this.panelOpenState;

		const editor = document.getElementById('editor') as HTMLElement;

		const vh = window.innerHeight;

		if (this.panelOpenState) {
			editor.style.height = `${vh - 402}px`;
		} else {
			editor.style.height = `${vh - 160}px`;
		}
	}

	viewUserProfile(uid: any, displayName: string) {
		let screenWidth = '';
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			screenWidth = '100%';
		} else {
			screenWidth = '50%';
		}

		// Open dialog and populate the data attributes of the form fields
		this.dialog.open(ViewProfileComponent, {
			width: screenWidth,
			data: {
				uid,
				displayName,
			},
		});
	}
}
