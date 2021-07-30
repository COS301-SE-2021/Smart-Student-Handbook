import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPanelComponent } from '@app/core';
import { NotesPanelComponent } from '@app/components';

describe('MenuPanelComponent', () => {
	let component: MenuPanelComponent;
	let fixture: ComponentFixture<MenuPanelComponent>;

	// const notes = NotesPanelComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MenuPanelComponent],
			imports: [],
			providers: [NotesPanelComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
