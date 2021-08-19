import { TestBed } from '@angular/core/testing';

import { OpenNotebookPanelService } from '@app/services';

describe('OpenNotebookPanelService', () => {
	let service: OpenNotebookPanelService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [],
			providers: [], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(OpenNotebookPanelService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
