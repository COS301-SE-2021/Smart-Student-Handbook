import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
	AccountComponent,
	LoginComponent,
	RegisterComponent,
	RestPasswordComponent,
	ForgotPasswordComponent,
} from '@app/features/account';

const routes: Routes = [
	{
		path: '',
		component: AccountComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'resetPassword', component: RestPasswordComponent },
			{ path: 'forgotPassword', component: ForgotPasswordComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AccountRoutingModule {}
