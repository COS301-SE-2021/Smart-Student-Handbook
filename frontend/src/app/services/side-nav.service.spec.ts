import { TestBed } from '@angular/core/testing';

import { SideNavService } from '@app/services';

describe('SideNavService', () => {
	let service: SideNavService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SideNavService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
