import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

//Firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MessagingService } from './services/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';

//Angular Material
import { MaterialModule } from './material/material.module';

//Components
import { FolderPanelComponent } from './components/panels/folder-panel/folder-panel.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { SmartAssistPanelComponent } from './components/panels/smart-assist-panel/smart-assist-panel.component';
import { NotesPanelComponent } from './components/panels/notes-panel/notes-panel.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { RestPasswordComponent } from './components/account/reset-password/rest-password.component';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { GlobalErrorComponent } from './components/modals/global/global-error/global-error.component';
import { GlobalConfirmComponent } from './components/modals/global/global-confirm/global-confirm.component';

import { HttpClientModule } from '@angular/common/http';
import { EditorComponent } from './components/editor/editor.component';
import { EditProfileComponent } from './components/modals/edit-profile/edit-profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AddNotebookComponent } from './components/modals/add-notebook/add-notebook.component';
import { ConfirmDeleteComponent } from './components/modals/confirm-delete/confirm-delete.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NotebookBottomSheetComponent } from './components/modals/notebook-bottom-sheet/notebook-bottom-sheet.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';


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
    EditorComponent,
    NotebookBottomSheetComponent,
    TreeViewComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'smartStudentNotebook'),
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
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [NotesPanelComponent, MessagingService, AsyncPipe, FolderPanelComponent, MaterialModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
