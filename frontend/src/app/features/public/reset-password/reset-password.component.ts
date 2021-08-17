import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, ResetPasswordService } from '@app/services';
import { MustMatch } from '@app/features/public/register/must-match.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-rest-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	form: FormGroup;

	errorMessage: string = '';

	user: any;

	constructor(
		private fb: FormBuilder,
		private resetPasswordService: ResetPasswordService,
		private activeRoute: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
		private accountService: AccountService
	) {
		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		// setup the form and validation
		this.form = this.fb.group(
			{
				password: ['', Validators.required],
				confirmPassword: ['', Validators.required],
			},
			{
				validator: MustMatch('password', 'confirmPassword'),
			}
		);
	}

	onSubmit() {
		// check if form is valid
		if (this.form.valid) {
			const password = this.form.get('password')?.value;

			let isLocalHost = false;
			if (window.location.host.includes('localhost')) {
				isLocalHost = true;
			}

			let email = '';
			let code = '';

			this.activeRoute.queryParams.subscribe((params) => {
				email = params.email;
				code = params.code;

				this.resetPasswordService
					.finalizeResetPassword(
						this.user.id,
						email,
						isLocalHost,
						password,
						code
					)
					.subscribe(() => {
						this.snackBar
							.open('Password successfully reset', 'Login')
							.afterDismissed()
							.subscribe(() => {
								this.router.navigate(['account/login']);
							});
					});
			});
		}
	}
}
