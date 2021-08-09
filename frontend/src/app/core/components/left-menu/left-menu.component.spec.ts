import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LeftMenuComponent, MaterialModule } from '@app/core';
import { NotesPanelComponent, TreeViewComponent } from '@app/components';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuPanelComponent', () => {
	let component: LeftMenuComponent;
	let fixture: ComponentFixture<LeftMenuComponent>;

	// const notes = NotesPanelComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				RouterModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [LeftMenuComponent, TreeViewComponent],
			providers: [NotesPanelComponent], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LeftMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
