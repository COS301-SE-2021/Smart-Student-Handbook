// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AsyncPipe } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireStorage } from '@angular/fire/storage';

// Core
import {
	MaterialModule,
	LeftMenuComponent,
	P404Component,
	HeaderComponent,
	SecureLayoutComponent,
	PublicLayoutComponent,
	JwtInterceptor,
} from '@app/core';
import { environment } from '@environments/environment';

// Services

// Features
import {
	NotebookComponent,
	HomeComponent,
	ExploreComponent,
	SharedWithMeComponent,
	NotificationsComponent,
} from '@app/features';

// public
import {
	LoginComponent,
	RegisterComponent,
	ResetPasswordComponent,
	LandingPageComponent,
	ForgotPasswordComponent,
} from '@app/features/public';

// Mobile
import {
	NotebookBottomSheetComponent,
	NotesComponent,
	SmartAssistBottomSheetComponent,
} from '@app/mobile';

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
	AddCollaboratorComponent,
	MessageComponent,
	AddNoteComponent,
	ViewProfileComponent,
	NoteCardsComponent,
	ExploreNotesEditorComponent,
	ExploreNoteListComponent,
	ExploreNotesEditorBottomSheetComponent,
	ExploreNoteListBottomsheetComponent,
	NoteInfoComponent,
	SmartAssistComponent,
	SmartAssistModalComponent,
	RateNotebookComponent,
	CloneNoteComponent,
	WelcomeComponent,
} from '@app/components';

// Long press
import { NgxLongPress2Module } from 'ngx-long-press2';

import { QuillModule } from 'ngx-quill';

import { MessagingService } from '@app/services';
import { NgAisModule } from 'angular-instantsearch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { ReadOnlyEditorComponent } from './components/read-only-editor/read-only-editor.component';
import { DeleteNoteComponent } from './components/modals/delete-note/delete-note.component';

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
		SharedWithMeComponent,
		NotificationsComponent,
		HeaderComponent,
		SecureLayoutComponent,
		PublicLayoutComponent,
		LoginComponent,
		RegisterComponent,
		ResetPasswordComponent,
		LandingPageComponent,
		ForgotPasswordComponent,
		AddCollaboratorComponent,
		AddNoteComponent,
		MessageComponent,
		ViewProfileComponent,
		NoteCardsComponent,
		ExploreNotesEditorComponent,
		ExploreNoteListComponent,
		ExploreNotesEditorBottomSheetComponent,
		ExploreNoteListBottomsheetComponent,
		NoteInfoComponent,
		SmartAssistComponent,
		SmartAssistBottomSheetComponent,
		SmartAssistModalComponent,
		RateNotebookComponent,
		CloneNoteComponent,
		WelcomeComponent,
		NoteEditorComponent,
		ReadOnlyEditorComponent,
  DeleteNoteComponent,
	],
	imports: [
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgAisModule.forRoot(),
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
		AngularFirestoreModule,
		FlexLayoutModule,
		NgxLongPress2Module,
		HttpClientModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
		QuillModule.forRoot(),
	],
	providers: [
		NotesPanelComponent,
		MessagingService,
		AsyncPipe,
		LeftMenuComponent,
		MaterialModule,
		AngularFireStorage,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
