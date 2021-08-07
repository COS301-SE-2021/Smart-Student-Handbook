import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-rest-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	form: FormGroup;

	errorMessage: string = '';

	constructor(private fb: FormBuilder) {
		// setup the form and validation
		this.form = this.fb.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		});
	}

	onSubmit() {
		// check if form is valid
		if (this.form.valid) {
			const password = this.form.get('password')?.value;

			const resetPassword = document.getElementById(
				'resetPassword'
			) as HTMLDivElement;

			resetPassword.style.display = 'none';

			const checkMail = document.getElementById(
				'checkMail'
			) as HTMLDivElement;

			checkMail.style.display = 'block';
		}
	}
}
