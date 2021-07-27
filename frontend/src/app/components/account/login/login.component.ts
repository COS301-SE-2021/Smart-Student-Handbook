import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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

	async ngOnInit(): Promise<void> {
		// if user is already logged in move them to the notebook page, if not return to login
		await this.accountService.isUserLoggedIn();
		// add image background to body
		document.body.className = 'backgroundIMG';
	}

	ngOnDestroy() {
		// Remove image background to body
		document.body.className = '';
	}

	// When user submits Login form
	async onSubmit(): Promise<void> {
		this.loginFailed = false;

		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;
			const password = this.form.get('password')?.value;

			// Call the account service to login the user with Firebase
			this.accountService.loginUser(email, password).subscribe(
				(data) => {
					this.loginFailed = false;
					// If login was successful then go to the notebook home page
					this.router.navigate(['notebook']);
				},
				(err) => {
					this.loginFailed = true;
					this.errorMessage = `Error: ${err.error.message}`;
				}
			);
		} else {
		}
	}
}
