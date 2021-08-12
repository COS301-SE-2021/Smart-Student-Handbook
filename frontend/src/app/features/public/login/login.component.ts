import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/services';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	form: FormGroup;

	loginFailed = false;

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
		this.form = this.fb.group({
			email: ['', Validators.email],
			password: ['', Validators.required],
		});
	}

	// When user submits Login form
	onSubmit() {
		const progressbar = document.getElementById(
			'notesProgressbar'
		) as HTMLElement;
		if (progressbar) progressbar.style.display = 'block';
		this.isDisabled = true;

		if (this.form.valid) {
			const email = this.form.get('email')?.value.slice();
			const password = this.form.get('password')?.value;

			// Call the account service to login the user with Firebase
			this.accountService.loginUser(email, password).subscribe(
				(res: any) => {
					if (res.success) {
						this.loginFailed = false;
						this.router.navigate(['/notebook']);

						if (progressbar) progressbar.style.display = 'none';
						this.isDisabled = false;
					} else {
						this.loginFailed = true;
						this.errorMessage =
							'Username or Password was incorrect, Please try again!';
						if (progressbar) progressbar.style.display = 'none';
						this.isDisabled = false;
					}
				},
				(err) => {
					this.loginFailed = true;
					this.errorMessage = err.error.message;
				}
			);
		} else {
			if (progressbar) progressbar.style.display = 'none';
			this.isDisabled = false;
		}
	}
}
