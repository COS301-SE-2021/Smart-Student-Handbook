import { TestBed } from '@angular/core/testing';

import { AccountService, MessagingService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@environments/environment';
import { BehaviorSubject } from 'rxjs';

const FirestoreStub = {
	collection: () => ({
		// name: string
		doc: () => ({
			// _id: string
			valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
			set: () =>
				// _d: any
				new Promise<void>((resolve) => resolve()), // , _reject
		}),
	}),
};

describe('MessagingService', () => {
	let service: MessagingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
				AngularFireMessagingModule,
				AngularFirestoreModule,
				AngularFireModule.initializeApp(environment.firebase),
			],
			declarations: [],
			providers: [
				AccountService,
				MessagingService,
				{ provide: MessagingService, useValue: FirestoreStub },
			], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(MessagingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
