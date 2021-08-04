import { TestBed } from '@angular/core/testing';

import { OpenNotebookPanelService } from './open-notebook-panel.service';

describe('OpenNotebookPanelService', () => {
	let service: OpenNotebookPanelService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(OpenNotebookPanelService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
