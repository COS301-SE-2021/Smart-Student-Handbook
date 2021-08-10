import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, ProfileService } from '@app/services';
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

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private profileService: ProfileService
	) {
		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}

		// setup the form and validation
		this.form = this.fb.group(
			{
				email: ['', Validators.email],
				phoneNumber: ['', Validators.required],
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

		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;
			const phoneNumber = `+27${this.form.get('phoneNumber')?.value}`;
			const displayName = this.form.get('displayName')?.value;
			const password = this.form.get('password')?.value;
			const passwordConfirm = this.form.get('passwordConfirm')?.value;

			// Call account service to register a new Account
			this.accountService
				.registerUser(
					email,
					phoneNumber,
					displayName,
					password,
					passwordConfirm
				)
				.subscribe(
					(data) => {
						// let dateJoined = '{"_seconds":'+Date.now().toString()+', "_nanoseconds":0}';
						// If RegisterUser was successful create a new user profile with default values
						this.profileService
							.createUser(
								data.uid,
								data.displayName,
								'',
								'',
								'',
								'',
								'',
								Date.now().toString()
							)
							.subscribe(
								() => {
									// If createUser was successful then login the user and take them to the notebook page
									this.accountService
										.loginUser(email, password)
										.subscribe(
											() => {
												this.registerFailed = false;
												this.router.navigateByUrl(
													`notebook`
												);
											},
											(err) => {
												this.registerFailed = true;
												this.errorMessage = `Error: ${err.error.message}`;
											}
										);
								},
								(err) => {
									this.registerFailed = true;
									this.errorMessage = `Error: ${err.error.message}`;
								}
							);
					},
					(err) => {
						this.registerFailed = true;
						this.errorMessage = `Error: ${err.error.message}`;
					}
				);
		}
	}
}