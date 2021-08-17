import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from '@app/features/public';
import { MaterialModule } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountService, MessagingService } from '@app/services';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '@environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import {
	AngularFirestore,
	AngularFirestoreModule,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

const FirestoreStub = {
	collection: (name: string) => ({
		doc: (_id: string) => ({
			valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
			set: (_d: any) =>
				new Promise<void>((resolve, _reject) => resolve()),
		}),
	}),
};

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				RouterTestingModule.withRoutes([]),
				HttpClientTestingModule,
				AngularFireMessagingModule,
				AngularFirestoreModule,
				AngularFireModule.initializeApp(environment.firebase),
			],
			declarations: [LoginComponent],
			providers: [
				AccountService,
				MessagingService,
				{ provide: MessagingService, useValue: FirestoreStub },
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
