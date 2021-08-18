import { TestBed } from '@angular/core/testing';

import { AccountService } from '@app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
	let service: AccountService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [AccountService], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(AccountService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
