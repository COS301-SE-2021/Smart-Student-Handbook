import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from '@app/features/public';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountService, MessagingService } from '@app/services';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@environments/environment';
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

describe('RegisterComponent', () => {
	let component: RegisterComponent;
	let fixture: ComponentFixture<RegisterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterModule,
				FormsModule,
				MatDialogModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				RouterTestingModule.withRoutes([]),
				HttpClientTestingModule,
				AngularFireMessagingModule,
				AngularFirestoreModule,
				AngularFireModule.initializeApp(environment.firebase),
			],
			declarations: [RegisterComponent],
			providers: [
				AccountService,
				MessagingService,
				{ provide: MessagingService, useValue: FirestoreStub },
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RegisterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
