import { TestBed } from '@angular/core/testing';

import { NotebookObservablesService } from './notebook-observables.service';

describe('NotebookObservablesService', () => {
	let service: NotebookObservablesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotebookObservablesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
