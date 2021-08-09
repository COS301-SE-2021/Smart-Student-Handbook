import { TestBed } from '@angular/core/testing';

import { ProfileService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileService', () => {
	let service: ProfileService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [ProfileService],
			// schemas: []
		});
		service = TestBed.inject(ProfileService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
