import { TestBed } from '@angular/core/testing';

import { NotebookOperationsService } from './notebook-operations.service';

describe('NotebookOperationsService', () => {
	let service: NotebookOperationsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotebookOperationsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
