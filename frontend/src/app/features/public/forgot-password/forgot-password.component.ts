import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, ResetPasswordService } from '@app/services';
import { Router } from '@angular/router';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	form: FormGroup;

	errorMessage: string = '';

	constructor(
		private fb: FormBuilder,
		private resetPasswordService: ResetPasswordService,
		private accountService: AccountService,
		private router: Router
	) {
		// setup the form and validation
		this.form = this.fb.group({
			email: ['', Validators.email],
		});

		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}
	}

	onSubmit() {
		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;

			let isLocalHost = false;
			if (window.location.host.includes('localhost')) {
				isLocalHost = true;
			}

			this.resetPasswordService
				.requestResetPassword(email, isLocalHost)
				.subscribe(() => {
					const resetPassword = document.getElementById(
						'resetPassword'
					) as HTMLDivElement;

					resetPassword.style.display = 'none';

					const checkMail = document.getElementById(
						'checkMail'
					) as HTMLDivElement;

					checkMail.style.display = 'block';
				});
		}
	}
}
