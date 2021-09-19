import { TestBed } from '@angular/core/testing';

import { TreeViewObservablesService } from './tree-view-observables.service';

describe('TreeViewObservablesService', () => {
	let service: TreeViewObservablesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TreeViewObservablesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
