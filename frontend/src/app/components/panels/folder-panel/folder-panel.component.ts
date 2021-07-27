import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '../../../services/notebook.service';
import { ProfileService } from '../../../services/profile.service';
import { EditProfileComponent } from '../../modals/edit-profile/edit-profile.component';
import { TreeViewComponent } from '../../tree-view/tree-view.component';

@Component({
	selector: 'app-folder-panel',
	templateUrl: './folder-panel.component.html',
	styleUrls: ['./folder-panel.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class FolderPanelComponent implements OnInit {
	// Hold user information
	user: any;

	profile: any;

	open: boolean = false;

	// Variables to be used when updating user profile
	username: string = '';

	bio: string = '';

	institution: string = '';

	department: string = '';

	name: string = '';

	program: string = '';

	workstatus: string = '';

	panelOpenState = false;

	width = 68.3;

	@ViewChild('treeViewComponent') treeViewComponent!: TreeViewComponent;

	/**
	 * The folder panel component constructor
	 * @param notebookService call notebook related queries to the backend
	 * @param profileService call user profile related queries to the backend
	 * @param dialog open a dialog when a user wants to edit their information
	 */
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog
	) {}

	/**
	 * Get the note structure of the logged in user
	 * Get the user information from localstorage
	 */
	ngOnInit(): void {
		// Get the user and user profile info from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));

		this.username = this.user.displayName;
		this.bio = this.profile.userInfo.bio;
	}

	/**
	 * Toggle the sliding panel (open and close)
	 */
	openedCloseToggle() {
		const sideNav = document.getElementById('container') as HTMLElement;
		const col = sideNav?.parentElement?.parentElement;

		if (sideNav.style.width === '100%') {
			sideNav.style.width = '40px';

			if (col) {
				col.style.width = 'fit-content';
				col.style.minWidth = '0px';
			}
		} else {
			sideNav.style.width = '100%';

			if (col) {
				col.style.width = '16.6666666667%';
				col.style.minWidth = '250px';
			}
		}
	}

	/**
	 * Open a modal popup with a form to view and update the users profile
	 */
	updateProfile() {
		// Retrieve the current lodged in user from localstorage
		const user = JSON.parse(<string>localStorage.getItem('user'));

		// Call the getUserDetails from the profile service to get the users profile information that match that uid
		this.profileService.getUserDetails(user.uid).subscribe(
			(data) => {
				// Open dialog and populate the data attributes of the form fields
				const dialogRef = this.dialog.open(EditProfileComponent, {
					width: '50%',
					data: {
						bio: data.userInfo.bio,
						department: data.userInfo.department,
						name: data.userInfo.name,
						institution: data.userInfo.institution,
						program: data.userInfo.program,
						workstatus: data.userInfo.workStatus,
					},
				});

				// Get info and create notebook after dialog is closed
				dialogRef.afterClosed().subscribe((result) => {
					if (result !== undefined) {
						// update the user profile information based on the entered values in the form
						this.profileService
							.updateUser(
								user.uid,
								result.name,
								result.institution,
								result.department,
								result.program,
								result.workstatus,
								result.bio
							)
							.subscribe(
								(data) => {},
								(err) => {
									console.log(`Error: ${err.error.message}`);
								}
							);
					}
				});
			},
			(err) => {
				console.log(`Error: ${err.error.message}`);
			}
		);
	}
}

/**
 * Tree structure
 */
interface DirectoryNode {
	name: string;
	id: string;
	children?: DirectoryNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	id: string;
	level: number;
}
