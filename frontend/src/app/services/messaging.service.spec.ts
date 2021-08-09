import { TestBed } from '@angular/core/testing';

import { MessagingService } from '@app/services';

describe('MessagingService', () => {
	let service: MessagingService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [],
			providers: [], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(MessagingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
