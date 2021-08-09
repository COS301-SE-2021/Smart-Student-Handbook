import { TestBed } from '@angular/core/testing';

import { NotebookService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotebookService', () => {
	let service: NotebookService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [NotebookService],
			// schemas: []
		});
		service = TestBed.inject(NotebookService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
