import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core';

import { NotesComponent } from '@app/mobile';

import {
	HomeComponent,
	ExploreComponent,
	NotebookComponent,
} from 'src/app/features';

const accountModule = () =>
	import('src/app/features/account/account.module').then(
		(x) => x.AccountModule
	);

const routes: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
	{
		path: 'notebook',
		component: NotebookComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'notes',
		component: NotesComponent,
		canActivate: [AuthGuard],
	},
	{ path: 'account', loadChildren: accountModule },

	// otherwise redirect to home
	{ path: '**', redirectTo: 'home' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
