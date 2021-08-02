import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
	AccountComponent,
	LoginComponent,
	RegisterComponent,
	ResetPasswordComponent,
	LandingPageComponent,
} from '@app/features/account';

const routes: Routes = [
	{
		path: '',
		component: AccountComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'resetPassword', component: ResetPasswordComponent },
			{ path: 'welcome', component: LandingPageComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AccountRoutingModule {}
