import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotebookComponent } from '@app/components';
import { MaterialModule } from '@app/core';
// import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';

describe('AddNotebookComponent', () => {
	let component: AddNotebookComponent;
	let fixture: ComponentFixture<AddNotebookComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			// imports: [MaterialModule, RouterModule],
			declarations: [AddNotebookComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatDialogModule,
			],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {
						hasBackdrop: true,
					},
				},
				{ provide: MAT_DIALOG_DATA, useValue: {} },
			],
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
