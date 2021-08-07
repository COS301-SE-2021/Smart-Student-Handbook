import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/services';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
	form: FormGroup;

	loginFailed = false;

	errorMessage: string = '';

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService
	) {
		// setup the form and validation
		this.form = this.fb.group({
			email: ['', Validators.email],
			password: ['', Validators.required],
		});
	}

	ngOnInit() {
		// add image background to body
		document.body.className = 'backgroundIMG';
	}

	ngOnDestroy() {
		// Remove image background to body
		document.body.className = '';
	}

	// When user submits Login form
	onSubmit() {
		this.loginFailed = false;

		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;
			const password = this.form.get('password')?.value;

			// Call the account service to login the user with Firebase
			this.accountService.loginUser(email, password).subscribe(
				() => {
					this.loginFailed = false;
					this.accountService.setUserSessionLocalStorage();
					this.accountService.setLoginState = true;
					localStorage.setItem('loginState', 'true');

					this.router.navigate(['notebook']);
					// this.router.navigateByUrl(`notebook`);
				},
				(err) => {
					this.loginFailed = true;
					this.errorMessage = `Error: ${err.error.message}`;
				}
			);
		}
	}
}
