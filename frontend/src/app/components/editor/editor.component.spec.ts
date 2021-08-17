import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComponent, EditorComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
	NotebookEventEmitterService,
	NotebookService,
	NoteMoreService,
	NotesService,
	NotificationService,
	ProfileService,
} from '@app/services';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

describe('EditorComponent', () => {
	let component: EditorComponent;
	let fixture: ComponentFixture<EditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
				MatDialogModule,
				MatBottomSheetModule,
				RouterTestingModule.withRoutes([
					{ path: '', component: ConfirmDeleteComponent },
				]),
			],
			declarations: [EditorComponent, ConfirmDeleteComponent],
			providers: [
				NotebookService,
				NotesService,
				ProfileService,
				NoteMoreService,
				NotificationService,
				NotebookEventEmitterService,
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
