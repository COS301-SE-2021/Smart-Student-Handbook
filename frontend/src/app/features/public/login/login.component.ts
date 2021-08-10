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
		if (this.form.valid) {
			const email = this.form.get('email')?.value;
			const password = this.form.get('password')?.value;

			// Call the account service to login the user with Firebase
			this.accountService.loginUser(email, password).subscribe(
				(res: any) => {
					if (res.success) {
						this.loginFailed = false;
						this.router.navigate(['/notebook']);
						// this.router.navigateByUrl(`notebook`);
						// TODO SET A LOADER FOR LOGIN
					} else {
						this.loginFailed = true;
						this.errorMessage =
							'Username or Password was incorrect, Please try again!';
					}
				},
				(err) => {
					this.loginFailed = true;
					this.errorMessage = err.error.message;
				}
			);
		}
	}
}
