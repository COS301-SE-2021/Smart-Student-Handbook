import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PageNotFoundComponent } from '@app/core';

import { NotesComponent } from '@app/mobile';

import {
	HomeComponent,
	ExploreComponent,
	NotebookComponent,
	NotificationsComponent,
	RecentNotesComponent,
	SharedWithMeComponent,
} from 'src/app/features';

const accountModule = () =>
	import('src/app/features/account/account.module').then(
		(x) => x.AccountModule
	);

const routes: Routes = [
	{ path: '', component: NotebookComponent, canActivate: [AuthGuard] },
	{ path: 'explore', component: ExploreComponent, canActivate: [AuthGuard] },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{
		path: 'notifications',
		component: NotificationsComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'recentNotes',
		component: RecentNotesComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'sharedWithMe',
		component: SharedWithMeComponent,
		canActivate: [AuthGuard],
	},
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
	{ path: 'pageNotFound', component: PageNotFoundComponent },
	{ path: 'account', loadChildren: accountModule },
	// otherwise redirect to home
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
