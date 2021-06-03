import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
// import { notebookComponent } from '.notebook/notebook.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// const redirectToLogin = () => redirectUnauthorizedTo(['']);
//
// const redirectToProfile = () => map(
//   user => user ? ['profile', (user as any).uid] : true
// );
//
// // const onlyAllowSelf = next => map(
// const onlyAllowSelf = (next: { params: { id: any; }; }) => map(
//   // tslint:disable-next-line: triple-equals
//   user => (!!user && next.params.id == (user as any).uid) || ['']
// );

const routes: Routes = [
  // {
  //   path: '',
  //   component: LoginComponent,
  //   canActivate: [AngularFireAuthGuard],
  //   data: {
  //     authGuardPipe: redirectToProfile
  //   }
  // },
  // {
  //   path: 'profile/:id',
  //   component: notebookComponent,
  //   canActivate: [AngularFireAuthGuard],
  //   data: {
  //     authGuardPipe: onlyAllowSelf
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
