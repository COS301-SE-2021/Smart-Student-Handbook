import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { FolderPanelComponent } from './components/folder-panel/folder-panel.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { FormsModule } from '@angular/forms';
import { NotebookComponent } from './notebook/notebook.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SmartAssistPanelComponent } from './components/folder-panel/smart-assist-panel/smart-assist-panel.component';
import { NotesPanelComponent } from './components/folder-panel/notes-panel/notes-panel.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatCommonModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './services/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { RestPasswordComponent } from './components/account/reset-password/rest-password.component';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';


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
    ForgotPasswordComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatTreeModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatToolbarModule,
    MatChipsModule,
    MatCommonModule,
    MatInputModule,
    CKEditorModule,
    MDBBootstrapModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [NotesPanelComponent, MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
