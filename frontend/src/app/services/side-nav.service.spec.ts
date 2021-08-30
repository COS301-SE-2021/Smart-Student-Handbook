import { TestBed } from '@angular/core/testing';

import { SideNavService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideNavService', () => {
	let service: SideNavService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [SideNavService], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(SideNavService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
