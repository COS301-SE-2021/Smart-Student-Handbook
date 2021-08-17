import { TestBed } from '@angular/core/testing';

import { NotebookDataService } from './notebookData.service';

describe('TestService', () => {
	let service: NotebookDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotebookDataService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
