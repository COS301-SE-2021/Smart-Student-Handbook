import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	NotebookDataService,
	NotebookEventEmitterService,
	NotebookService,
	NoteMoreService,
	OpenNotebookPanelService,
} from '@app/services';
import { MatDialogModule } from '@angular/material/dialog';

describe('TreeViewComponent', () => {
	let component: TreeViewComponent;
	let fixture: ComponentFixture<TreeViewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				MatDialogModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [TreeViewComponent],
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
		fixture = TestBed.createComponent(TreeViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
