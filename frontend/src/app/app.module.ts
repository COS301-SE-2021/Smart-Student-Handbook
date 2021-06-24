import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

//Modules
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

//Editor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'

//Firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging'
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { MessagingService } from './services/messaging.service'
import { environment } from '../environments/environment'
import { AsyncPipe } from '../../node_modules/@angular/common'

//Angular Material
import { MaterialModule } from './material/material/material.module'

//Components
import { FolderPanelComponent } from './components/folder-panel/folder-panel.component'
import { NotebookComponent } from './notebook/notebook.component'
import { SmartAssistPanelComponent } from './components/folder-panel/smart-assist-panel/smart-assist-panel.component'
import { NotesPanelComponent } from './components/folder-panel/notes-panel/notes-panel.component'
import { LoginComponent } from './components/account/login/login.component'
import { RegisterComponent } from './components/account/register/register.component'
import { RestPasswordComponent } from './components/account/reset-password/rest-password.component'
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component'
import { GlobalErrorComponent } from './components/modals/global/global-error/global-error.component'
import { GlobalConfirmComponent } from './components/modals/global/global-confirm/global-confirm.component'

import { HttpClientModule } from '@angular/common/http'
import { AddNotebookComponent } from './notebook/add-notebook/add-notebook.component'
import { MatDialogRef } from '@angular/material/dialog'
import { ConfirmDeleteComponent } from './notebook/confirm-delete/confirm-delete.component'
import { EditProfileComponent } from './notebook/edit-profile/edit-profile.component'

@NgModule({
	declarations: [
		AppComponent,
		FolderPanelComponent,
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
	],
	imports: [
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		CKEditorModule,
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
		HttpClientModule,
	],
	providers: [
		NotesPanelComponent,
		MessagingService,
		AsyncPipe,
		FolderPanelComponent,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
