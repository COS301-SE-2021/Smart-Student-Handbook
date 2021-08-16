import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, MessagingService } from '@app/services';
import { EditProfileComponent, MessageComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { MustMatch } from './must-match.validator';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	form: FormGroup;

	registerFailed = false;

	submitted = false;

	errorMessage: string = '';

	isDisabled: boolean = false;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private messagingService: MessagingService,
		private dialog: MatDialog
	) {
		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}

		// setup the form and validation
		this.form = this.fb.group(
			{
				email: ['', Validators.email],
				displayName: ['', Validators.required],
				password: ['', Validators.required],
				passwordConfirm: ['', Validators.required],
			},
			{
				validator: MustMatch('password', 'passwordConfirm'),
			}
		);
	}

	// When user submits Register form
	async onSubmit(): Promise<void> {
		this.registerFailed = false;
		this.submitted = true;

		const progressbar = document.getElementById(
			'notesProgressbar'
		) as HTMLElement;
		if (progressbar) progressbar.style.display = 'block';
		this.isDisabled = true;

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

		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value.slice();
			const displayName = this.form.get('displayName')?.value.slice();
			const password = this.form.get('password')?.value;
			const passwordConfirm = this.form.get('passwordConfirm')?.value;

			let isLocalHost = false;
			if (window.location.host.includes('localhost')) {
				isLocalHost = true;
			}

			// Call account service to register a new Account
			this.accountService
				.registerUser(
					email,
					displayName,
					password,
					passwordConfirm,
					isLocalHost
				)
				.subscribe(
					(res: any) => {
						if (res.success) {
							// If createUser was successful then login the user and take them to the notebook page
							this.accountService
								.loginUser(email, password)
								.subscribe(
									(x: any) => {
										if (x.success) {
											//--------------------------------------------------------------
											// Retrieve the current lodged in user from localstorage
											const user = JSON.parse(
												<string>(
													localStorage.getItem('user')
												)
											);

											this.messagingService.saveNotificationToken(
												x.user.uid
											);
											this.messagingService.requestPermission();
											this.messagingService.receiveMessage();

											// check if a user is not null
											if (user) {
												// Welcome user and prompt to update their profile
												const confirm =
													this.dialog.open(
														MessageComponent,
														{
															data: {
																title: 'Welcome',
																message1:
																	'Welcome to the Smart Student Handbook',
																message2:
																	'Please kindly update your profile to help Smart Assist recommend relevant content and notes',
															},
														}
													);

												// Open the Update profile modal after user confirms to update profile
												confirm
													.afterClosed()
													.subscribe((r) => {
														if (r) {
															// Open dialog and populate the data attributes of the form fields
															const dialogRef =
																this.dialog.open(
																	EditProfileComponent,
																	{
																		width: screenWidth,
																		data: user,
																	}
																);

															// after the user closes the update profile form
															dialogRef
																.afterClosed()
																.subscribe(
																	() => {}
																);
														}
													});
											}
											//--------------------------------------------------------------

											this.registerFailed = false;
											this.router.navigateByUrl(`/home`);
											if (progressbar)
												progressbar.style.display =
													'none';
											this.isDisabled = false;
										} else {
											this.registerFailed = true;
											this.errorMessage = `${x.message} - ${x.error}`;
											if (progressbar)
												progressbar.style.display =
													'none';
											this.isDisabled = false;
										}
									},
									(err) => {
										this.registerFailed = true;
										this.errorMessage = `${err.message} - ${err.error}`;
										if (progressbar)
											progressbar.style.display = 'none';
										this.isDisabled = false;
									}
								);
						} else {
							this.registerFailed = true;
							this.errorMessage = `${res.message} - ${res.error}`;
							if (progressbar) progressbar.style.display = 'none';
							this.isDisabled = false;
						}
					},
					(err) => {
						this.registerFailed = true;
						this.errorMessage = `${err.message} - ${err.error}`;
						if (progressbar) progressbar.style.display = 'none';
						this.isDisabled = false;
					}
				);
		}
	}
}
