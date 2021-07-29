import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPanelComponent } from './menu-panel.component';
import { NotesPanelComponent } from '../notes-panel/notes-panel.component';

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
