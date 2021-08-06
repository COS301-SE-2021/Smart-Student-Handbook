import { Routes } from '@angular/router';
import {
	ExploreComponent,
	HomeComponent,
	NotebookComponent,
	NotificationsComponent,
	RecentNotesComponent,
	SharedWithMeComponent,
} from '@app/features';
import { NotesComponent } from '@app/mobile';

export const SECURE_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'explore', component: ExploreComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'notifications', component: NotificationsComponent },
	{ path: 'recentNotes', component: RecentNotesComponent },
	{ path: 'sharedWithMe', component: SharedWithMeComponent },
	{ path: 'notebook', component: NotebookComponent },
	{ path: 'notes', component: NotesComponent },
];
