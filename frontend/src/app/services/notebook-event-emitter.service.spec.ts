import { TestBed } from '@angular/core/testing';

import { NotebookEventEmitterService } from './notebook-event-emitter.service';

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
