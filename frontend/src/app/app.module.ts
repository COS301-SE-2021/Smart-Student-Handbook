import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

// Modules
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { MessagingService } from './services/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';

// Angular Material
import { MaterialModule } from './core/material.module';

// Components
import { MenuPanelComponent } from './core/components/side-navigation-panel/menu-panel.component';
import { NotebookComponent } from './features/notebook/notebook.component';
import { SmartAssistPanelComponent } from './components/panels/smart-assist-panel/smart-assist-panel.component';
import { NotesPanelComponent } from './components/panels/notes-panel/notes-panel.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { RestPasswordComponent } from './features/account/reset-password/rest-password.component';
import { ForgotPasswordComponent } from './features/account/forgot-password/forgot-password.component';
import { GlobalErrorComponent } from './components/modals/global/global-error/global-error.component';
import { GlobalConfirmComponent } from './components/modals/global/global-confirm/global-confirm.component';

import { EditorComponent } from './components/editor/editor.component';
import { EditProfileComponent } from './components/modals/edit-profile/edit-profile.component';
import { AddNotebookComponent } from './components/modals/add-notebook/add-notebook.component';
import { ConfirmDeleteComponent } from './components/modals/confirm-delete/confirm-delete.component';

import { NotebookBottomSheetComponent } from './mobile/modals/notebook-bottom-sheet/notebook-bottom-sheet.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { NotesComponent } from './mobile/notes/notes.component';

import { NotebookEventEmitterService } from './services/notebook-event-emitter.service';

@NgModule({
	declarations: [
		AppComponent,
		MenuPanelComponent,
		NotebookComponent,
		SmartAssistPanelComponent,
		NotesPanelComponent,
		LoginComponent,
		RegisterComponent,
		RestPasswordComponent,
		ForgotPasswordComponent,
		GlobalErrorComponent,
		GlobalConfirmComponent,
		AddNotebookComponent,
		ConfirmDeleteComponent,
		EditProfileComponent,
		EditorComponent,
		NotebookBottomSheetComponent,
		TreeViewComponent,
		NotesComponent,
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
		MenuPanelComponent,
		MaterialModule,
		NotebookEventEmitterService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
