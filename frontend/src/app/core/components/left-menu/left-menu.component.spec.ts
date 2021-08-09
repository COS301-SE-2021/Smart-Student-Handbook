import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuComponent } from '@app/core';
import { NotesPanelComponent } from '@app/components';

describe('MenuPanelComponent', () => {
	let component: LeftMenuComponent;
	let fixture: ComponentFixture<LeftMenuComponent>;

	// const notes = NotesPanelComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LeftMenuComponent],
			imports: [],
			providers: [NotesPanelComponent], // Some stubs used here
			// schemas: []
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
