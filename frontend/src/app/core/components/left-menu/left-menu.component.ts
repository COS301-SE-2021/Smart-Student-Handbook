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

interface Page {
	link: string;
	name: string;
	icon: string;
}

@Component({
	selector: 'app-left-menu',
	templateUrl: './left-menu.component.html',
	styleUrls: ['./left-menu.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [onSideNavChange, animateText],
})
export class LeftMenuComponent implements OnInit {
	public pages: Page[] = [
		{ name: 'Inbox', link: 'some-link', icon: 'inbox' },
		{ name: 'Starred', link: 'some-link', icon: 'star' },
		{ name: 'Send email', link: 'some-link', icon: 'send' },
		{ name: 'Logout', link: 'logout()', icon: 'exit_to_app' },
	];

	public sideNavState: boolean = false;

	public linkText: boolean = false;

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
	 * The menu panel component constructor
	 * @param notebookService call notebook related queries to the backend
	 * @param profileService call user profile related queries to the backend
	 * @param dialog open a dialog when a user wants to edit their information
	 */
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog,
		private accountService: AccountService,
		private router: Router,
		private sidenavService: SideNavService
	) {}

	onSinenavToggle() {
		this.sideNavState = !this.sideNavState;

		setTimeout(() => {
			this.linkText = this.sideNavState;
		}, 200);
		this.sidenavService.sideNavState$.next(this.sideNavState);
	}

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
								() => {},
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

	/**
	 * If a user is not logged in, redirect them to the login page
	 */
	async logout() {
		this.accountService.singOut().subscribe(
			() => {
				// this.router.navigateByUrl(`/account/login`);
				localStorage.clear();
				this.accountService.setLoginState = false;
				this.router.navigate(['/account/login']);
				localStorage.setItem('loginState', 'false');
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
