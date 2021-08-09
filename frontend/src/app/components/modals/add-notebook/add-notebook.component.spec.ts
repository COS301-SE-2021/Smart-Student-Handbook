import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotebookComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AddNotebookComponent', () => {
	let component: AddNotebookComponent;
	let fixture: ComponentFixture<AddNotebookComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule, RouterModule],
			declarations: [AddNotebookComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AddNotebookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
