import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreComponent } from '@app/features';
import { MaterialModule } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExploreComponent', () => {
	let component: ExploreComponent;
	let fixture: ComponentFixture<ExploreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [ExploreComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExploreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
