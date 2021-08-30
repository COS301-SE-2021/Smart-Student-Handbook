import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, P404Component } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageNotFoundComponent', () => {
	let component: P404Component;
	let fixture: ComponentFixture<P404Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [P404Component],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
