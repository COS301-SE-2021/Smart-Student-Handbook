import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '@app/services/profile.service';
import { ResetPasswordService } from './reset-password.service';

describe('ResetPasswordService', () => {
	let service: ResetPasswordService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [ProfileService],
		});
		service = TestBed.inject(ResetPasswordService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
