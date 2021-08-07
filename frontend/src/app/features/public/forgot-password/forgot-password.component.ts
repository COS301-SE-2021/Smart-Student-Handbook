import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	form: FormGroup;

	errorMessage: string = '';

	constructor(private fb: FormBuilder) {
		// setup the form and validation
		this.form = this.fb.group({
			email: ['', Validators.email],
		});
	}

	onSubmit() {
		// check if form is valid
		if (this.form.valid) {
			const email = this.form.get('email')?.value;

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
