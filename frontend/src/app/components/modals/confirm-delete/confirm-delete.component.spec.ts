import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConfirmDeleteComponent', () => {
	let component: ConfirmDeleteComponent;
	let fixture: ComponentFixture<ConfirmDeleteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [ConfirmDeleteComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
