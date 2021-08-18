import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNotesComponent } from '@app/features';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RecentNotesComponent', () => {
	let component: RecentNotesComponent;
	let fixture: ComponentFixture<RecentNotesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [RecentNotesComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecentNotesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
