import { TestBed } from '@angular/core/testing';

import { ExploreObservablesService } from './explore-observables.service';

describe('ExploreObservablesService', () => {
	let service: ExploreObservablesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ExploreObservablesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
