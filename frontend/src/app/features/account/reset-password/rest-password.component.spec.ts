import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestPasswordComponent } from '@app/features';

describe('RestPasswordComponent', () => {
	let component: RestPasswordComponent;
	let fixture: ComponentFixture<RestPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RestPasswordComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RestPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
