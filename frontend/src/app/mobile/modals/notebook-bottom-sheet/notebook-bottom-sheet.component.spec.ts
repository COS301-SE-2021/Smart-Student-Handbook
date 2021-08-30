import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookBottomSheetComponent } from '@app/mobile';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import {
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetModule,
	MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// import { ConfirmDeleteComponent } from '@app/components';
import {
	NotebookService,
	NoteMoreService,
	NoteOperationsService,
	ProfileService,
} from '@app/services';

describe('NotebookBottomSheetComponent', () => {
	let component: NotebookBottomSheetComponent;
	let fixture: ComponentFixture<NotebookBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatBottomSheetModule,
				MatDialogModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [NotebookBottomSheetComponent],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {
						hasBackdrop: true,
					},
				},
				{ provide: MAT_DIALOG_DATA, useValue: {} },
				{ provide: MatBottomSheetRef, useValue: {} },
				{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
				ProfileService,
				NotebookService,
				NoteOperationsService,
				NoteMoreService,
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotebookBottomSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
