import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedWithMeComponent } from '@app/features';
import {
	NotebookEventEmitterService,
	NotebookService,
	NoteMoreService,
	OpenNotebookPanelService,
} from '@app/services';
import { MatDialogModule } from '@angular/material/dialog';
import { NotebookDataService } from '@app/services/notebookData.service';

describe('SharedWithMeComponent', () => {
	let component: SharedWithMeComponent;
	let fixture: ComponentFixture<SharedWithMeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
				MatDialogModule,
			],
			declarations: [SharedWithMeComponent],
			providers: [
				NotebookService,
				NoteMoreService,
				OpenNotebookPanelService,
				NotebookEventEmitterService,
				NotebookDataService,
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SharedWithMeComponent);
		component = fixture.componentInstance;
		// fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
