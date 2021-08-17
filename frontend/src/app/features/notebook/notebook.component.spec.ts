import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookComponent } from '@app/features';
import { MaterialModule } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	AccountService,
	NotebookEventEmitterService,
	OpenNotebookPanelService,
} from '@app/services';

describe('NotebookComponent', () => {
	let component: NotebookComponent;
	let fixture: ComponentFixture<NotebookComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [NotebookComponent],
			providers: [
				AccountService,
				NotebookEventEmitterService,
				OpenNotebookPanelService,
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotebookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
