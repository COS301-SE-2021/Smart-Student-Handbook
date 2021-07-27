import { NotesComponent } from './components/notes/notes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { RestPasswordComponent } from './components/account/reset-password/rest-password.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { AddNotebookComponent } from './components/modals/add-notebook/add-notebook.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    // loadChildren: () => import('./components/account/login/login.component').then( m => m.LoginComponent)
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'notebook',
    component: NotebookComponent
  },
  {
    path: 'notes',
    component: NotesComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
