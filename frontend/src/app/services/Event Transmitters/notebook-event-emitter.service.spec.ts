import { TestBed } from '@angular/core/testing';

import { NotebookEventEmitterService } from '@app/services';

describe('NotebookEventEmitterService', () => {
	let service: NotebookEventEmitterService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotebookEventEmitterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
