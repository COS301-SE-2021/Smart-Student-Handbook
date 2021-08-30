import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	// MAT_DIALOG_DEFAULT_OPTIONS,
	// MatDialog,
	// MatDialogActions,
	// MatDialogClose,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from '@app/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCollaboratorComponent } from './add-collaborator.component';

describe('AddCollaboratorComponent', () => {
	let component: AddCollaboratorComponent;
	let fixture: ComponentFixture<AddCollaboratorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AddCollaboratorComponent],
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
		fixture = TestBed.createComponent(AddCollaboratorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
