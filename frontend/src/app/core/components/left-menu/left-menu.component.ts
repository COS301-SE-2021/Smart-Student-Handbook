import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
	NotebookService,
	ProfileService,
	AccountService,
	SideNavService,
} from '@app/services';
import { EditProfileComponent, TreeViewComponent } from '@app/components';
import { animateText, onSideNavChange } from '@app/styling/animations';
import { User } from '@app/models';

@Component({
	selector: 'app-left-menu',
	templateUrl: './left-menu.component.html',
	styleUrls: ['./left-menu.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [onSideNavChange, animateText],
})
export class LeftMenuComponent implements OnInit {
	public sideNavState: boolean = false;

	public linkText: boolean = false;

	user: any;

	open: boolean = false;

	panelOpenState = false;

	width = 68.3;

	@ViewChild('treeViewComponent') treeViewComponent!: TreeViewComponent;

	/**
	 * The menu panel component constructor
	 * @param notebookService call notebook related queries to the backend
	 * @param profileService call user profile related queries to the backend
	 * @param dialog open a dialog when a user wants to edit their information
	 * @param accountService
	 * @param router
	 * @param sidenavService
	 */
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog,
		private accountService: AccountService,
		private router: Router,
		private sidenavService: SideNavService
	) {}

	/**
	 * Get the note structure of the logged in user
	 * Get the user information from localstorage
	 */
	ngOnInit(): void {
		// Get the user and user profile info from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));
	}

	onSinenavToggle() {
		this.sideNavState = !this.sideNavState;

		setTimeout(() => {
			this.linkText = this.sideNavState;
		}, 200);
		this.sidenavService.sideNavState$.next(this.sideNavState);
	}

	/**
	 * Open a modal popup with a form to view and update the users profile
	 */
	updateProfile() {
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

		// Retrieve the current lodged in user from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		// check if a user is not null
		if (this.user) {
			// Open dialog and populate the data attributes of the form fields
			const dialogRef = this.dialog.open(EditProfileComponent, {
				width: screenWidth,
				data: this.user,
			});

			// Get info and create notebook after dialog is closed
			dialogRef.afterClosed().subscribe((result) => {
				if (result !== undefined) {
					// update the user profile information based on the entered values in the form
					// TODO displayName needs to be updated with the user service, cant update the username !!!!
					this.profileService
						.updateUser(
							this.user.uid,
							result.name, // TODO this attribute needs to be removed as user cant change their username
							result.institution,
							result.department,
							result.program,
							result.workStatus,
							result.bio,
							result.profilePicUrl
						)
						.subscribe(
							(res: any) => {
								if (res.success) {
									// update the localstorage with the new users options
									this.accountService
										.getCurrentUser()
										.subscribe(() => {});
								}
							},
							(err) => {
								console.log(`Error: ${err.error.message}`);
							}
						);
				}
			});
		}
	}

	/**
	 * If a user is not logged in, redirect them to the login page
	 */
	async logout() {
		this.accountService.singOut().subscribe(
			() => {
				this.router.navigate(['account/login']);
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	children?: DirectoryNode[];
}

/** Flat node with expandable and level information */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	id: string;
	level: number;
}
