import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	let guard: AuthGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule],
			declarations: [],
			providers: [], // Some stubs used here
			// schemas: []
		});
		guard = TestBed.inject(AuthGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});
