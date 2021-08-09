import { TestBed } from '@angular/core/testing';

import { NotebookService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotebookService', () => {
	let service: NotebookService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [],
			providers: [],
			// schemas: []
		});
		service = TestBed.inject(NotebookService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
