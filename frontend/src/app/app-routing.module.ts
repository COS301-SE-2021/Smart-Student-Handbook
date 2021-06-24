import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/account/login/login.component'
import { RegisterComponent } from './components/account/register/register.component'
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component'
import { RestPasswordComponent } from './components/account/reset-password/rest-password.component'
import { NotebookComponent } from './notebook/notebook.component'
import { AddNotebookComponent } from './notebook/add-notebook/add-notebook.component'

const routes: Routes = [
	{
		path: '',
		component: LoginComponent,
	},
	{
		path: 'login',
		component: LoginComponent,
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
		path: 'add',
		component: AddNotebookComponent,
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
