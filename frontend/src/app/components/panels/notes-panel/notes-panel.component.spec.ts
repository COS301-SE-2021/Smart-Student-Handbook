import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSidenavModule } from '@angular/material/sidenav';
import { NotesPanelComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotesPanelComponent', () => {
	let component: NotesPanelComponent;
	let fixture: ComponentFixture<NotesPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatSidenavModule,
				BrowserAnimationsModule,
				MaterialModule,
				HttpClientTestingModule,
			],
			declarations: [NotesPanelComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotesPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
