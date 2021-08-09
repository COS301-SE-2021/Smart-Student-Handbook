import { TestBed } from '@angular/core/testing';

import { MessagingService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MessagingService', () => {
	let service: MessagingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [MessagingService], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(MessagingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
