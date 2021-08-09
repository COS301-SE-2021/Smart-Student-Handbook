import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from '@app/features/public';

describe('ResetPasswordComponent', () => {
	let component: ResetPasswordComponent;
	let fixture: ComponentFixture<ResetPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [ResetPasswordComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ResetPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
