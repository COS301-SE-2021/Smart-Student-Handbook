// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AsyncPipe } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';

// Core
import {
	MaterialModule,
	LeftMenuComponent,
	P404Component,
	HeaderComponent,
	SecureLayoutComponent,
	PublicLayoutComponent,
} from '@app/core';
import { environment } from '@environments/environment';

// Services

// Features
import {
	NotebookComponent,
	HomeComponent,
	ExploreComponent,
	RecentNotesComponent,
	SharedWithMeComponent,
	NotificationsComponent,
} from '@app/features';

// public
import {
	LoginComponent,
	RegisterComponent,
	ResetPasswordComponent,
	LandingPageComponent,
} from '@app/features/public';

// Mobile
import { NotebookBottomSheetComponent, NotesComponent } from '@app/mobile';

// Components
import {
	SmartAssistPanelComponent,
	NotesPanelComponent,
	GlobalErrorComponent,
	GlobalConfirmComponent,
	EditorComponent,
	EditProfileComponent,
	AddNotebookComponent,
	ConfirmDeleteComponent,
	TreeViewComponent,
} from '@app/components';

import { MessagingService, NotebookEventEmitterService } from '@app/services';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
	declarations: [
		AppComponent,
		LeftMenuComponent,
		NotebookComponent,
		SmartAssistPanelComponent,
		NotesPanelComponent,
		GlobalErrorComponent,
		GlobalConfirmComponent,
		AddNotebookComponent,
		ConfirmDeleteComponent,
		EditProfileComponent,
		EditorComponent,
		NotebookBottomSheetComponent,
		TreeViewComponent,
		NotesComponent,
		HomeComponent,
		ExploreComponent,
		P404Component,
		RecentNotesComponent,
		SharedWithMeComponent,
		NotificationsComponent,
		HeaderComponent,
		SecureLayoutComponent,
		PublicLayoutComponent,
		LoginComponent,
		RegisterComponent,
		ResetPasswordComponent,
		LandingPageComponent,
	],
	imports: [
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MDBBootstrapModule.forRoot(),
		AngularFireModule.initializeApp(
			environment.firebase,
			'smartStudentNotebook'
		),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFireMessagingModule,
		// AngularFireStorageModule,
		AngularFirestoreModule,
		FlexLayoutModule,
		HttpClientModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
	providers: [
		NotesPanelComponent,
		MessagingService,
		AsyncPipe,
		LeftMenuComponent,
		MaterialModule,
		NotebookEventEmitterService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
