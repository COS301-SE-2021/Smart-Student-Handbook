import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '@app/services';
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
		private accountService: AccountService
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

		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;
			const displayName = this.form.get('displayName')?.value;
			const password = this.form.get('password')?.value;
			const passwordConfirm = this.form.get('passwordConfirm')?.value;

			// Call account service to register a new Account
			this.accountService
				.registerUser(email, displayName, password, passwordConfirm)
				.subscribe(
					(res: any) => {
						if (res.success) {
							// If createUser was successful then login the user and take them to the notebook page
							this.accountService
								.loginUser(email, password)
								.subscribe(
									(x: any) => {
										if (x.success) {
											this.registerFailed = false;
											this.router.navigateByUrl(
												`/notebook`
											);
											// TODO SET A LOADER FOR Register
										} else {
											this.registerFailed = true;
											this.errorMessage =
												'An error occurred, please sign in manually!';
										}
									},
									(err) => {
										this.registerFailed = true;
										this.errorMessage = `Error: ${err.error.message}`;
									}
								);
						} else {
							this.errorMessage = res.message;
							// this.errorMessage = res.error;
						}
					},
					(err) => {
						this.registerFailed = true;
						this.errorMessage = `Error: ${err.error.message}`;
					}
				);
		}
	}
}
