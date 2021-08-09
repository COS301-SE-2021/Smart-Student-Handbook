import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P404Component } from '@app/core';

describe('PageNotFoundComponent', () => {
	let component: P404Component;
	let fixture: ComponentFixture<P404Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [P404Component],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(P404Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
