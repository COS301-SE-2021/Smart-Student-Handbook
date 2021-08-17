import { Routes } from '@angular/router';
import {
	LandingPageComponent,
	LoginComponent,
	RegisterComponent,
	ForgotPasswordComponent,
	ResetPasswordComponent,
} from '@app/features/public';
import { P404Component } from '@app/core';

export const PUBLIC_ROUTES: Routes = [
	{ path: '', redirectTo: 'account/login', pathMatch: 'full' },
	{ path: 'account/login', component: LoginComponent },
	{ path: 'account/register', component: RegisterComponent },
	{ path: 'account/forgotPassword', component: ForgotPasswordComponent },
	{
		path: 'account/resetPassword/:email/:code',
		component: ResetPasswordComponent,
	},
	{ path: 'welcome', component: LandingPageComponent },
	{ path: 'page-not-found', component: P404Component },
	// { path: 'e500', component: e500Component },
	// { path: 'maintenance', component: MaintenanceComponent },
];
