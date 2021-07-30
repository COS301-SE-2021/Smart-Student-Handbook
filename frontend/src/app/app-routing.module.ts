import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './mobile/notes/notes.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { ForgotPasswordComponent } from './features/account/forgot-password/forgot-password.component';
import { NotebookComponent } from './features/notebook/notebook.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component: LoginComponent,
		// loadChildren: () => import('./components/account/login/login.component').then( m => m.LoginComponent)
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'forgotPassword',
		component: ForgotPasswordComponent,
	},
	{
		path: 'notebook',
		component: NotebookComponent,
	},
	{
		path: 'notes',
		component: NotesComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
