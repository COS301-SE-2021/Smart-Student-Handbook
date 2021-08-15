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

	isDisabled: boolean = false;

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

		const progressbar = document.getElementById(
			'notesProgressbar'
		) as HTMLElement;
		if (progressbar) progressbar.style.display = 'block';
		this.isDisabled = true;

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
