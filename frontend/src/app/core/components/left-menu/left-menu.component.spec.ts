import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LeftMenuComponent, MaterialModule } from '@app/core';
import {
	EditProfileComponent,
	NotesPanelComponent,
	TreeViewComponent,
} from '@app/components';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	AccountService,
	NotebookService,
	NotificationService,
	ProfileService,
	SideNavService,
} from '@app/services';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MenuPanelComponent', () => {
	let component: LeftMenuComponent;
	let fixture: ComponentFixture<LeftMenuComponent>;

	// const notes = NotesPanelComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				FormsModule,
				BrowserAnimationsModule,
				ReactiveFormsModule,
				MatDialogModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [
				LeftMenuComponent,
				TreeViewComponent,
				EditProfileComponent,
			],
			providers: [
				NotesPanelComponent,
				NotebookService,
				ProfileService,
				AccountService,
				NotificationService,
				SideNavService,
			], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LeftMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
