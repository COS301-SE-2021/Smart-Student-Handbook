import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
	NotebookService,
	ProfileService,
	AccountService,
	SideNavService,
	NotificationService,
	MessagingService,
} from '@app/services';
import { EditProfileComponent, TreeViewComponent } from '@app/components';
import { animateText, onSideNavChange } from '@app/styling/animations';

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

	nrUnreadNotifications = 0;

	@ViewChild('treeViewComponent') treeViewComponent!: TreeViewComponent;

	/**
	 * The menu panel component constructor
	 * @param notebookService call notebook related queries to the backend
	 * @param profileService call user profile related queries to the backend
	 * @param dialog open a dialog when a user wants to edit their information
	 * @param accountService
	 * @param notificationService
	 * @param router
	 * @param sidenavService
	 * @param messagingService
	 */
	constructor(
		private notebookService: NotebookService,
		private profileService: ProfileService,
		private dialog: MatDialog,
		private accountService: AccountService,
		private notificationService: NotificationService,
		private router: Router,
		private sidenavService: SideNavService,
		private messagingService: MessagingService
	) {}

	/**
	 * Get the note structure of the logged in user
	 * Get the user information from localstorage
	 */
	ngOnInit(): void {
		// Get the user and user profile info from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.notificationService
			.getUnreadNotifications(this.user.uid)
			.subscribe((unreadNotifications) => {
				// console.log(unreadNotifications.length);
				this.nrUnreadNotifications = unreadNotifications.length;
			});
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
			dialogRef.afterClosed().subscribe(() => {
				// update the user object after the update
				this.user = JSON.parse(<string>localStorage.getItem('user'));
			});
		}
	}

	markNotificationsAsRead() {
		this.nrUnreadNotifications = 0;
	}

	/**
	 * If a user is not logged in, redirect them to the login page
	 */
	async logout() {
		if (this.user) {
			this.accountService.singOut(this.user.uid).subscribe(
				() => {
					this.router.navigate(['account/login']);
				},
				(err) => {
					console.log(`Error: ${err.error.message}`);
				}
			);
		}
	}
}
