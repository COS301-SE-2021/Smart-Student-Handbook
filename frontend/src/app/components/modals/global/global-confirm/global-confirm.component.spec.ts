import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfirmComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GlobalConfirmComponent', () => {
	let component: GlobalConfirmComponent;
	let fixture: ComponentFixture<GlobalConfirmComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [GlobalConfirmComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GlobalConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
