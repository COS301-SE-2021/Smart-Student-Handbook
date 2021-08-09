import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
	AuthGuard,
	PublicLayoutComponent,
	SecureLayoutComponent,
	PUBLIC_ROUTES,
	SECURE_ROUTES,
} from '@app/core';

const routes: Routes = [
	{
		path: '',
		component: PublicLayoutComponent,
		children: PUBLIC_ROUTES,
	},
	{
		path: '',
		component: SecureLayoutComponent,
		canActivate: [AuthGuard],
		children: SECURE_ROUTES,
	},
	{ path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
