import { TestBed } from '@angular/core/testing';

import { AccountService } from '@app/services';

describe('AuthService', () => {
	let service: AccountService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [],
			providers: [], // Some stubs used here
			// schemas: []
		});
		service = TestBed.inject(AccountService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
