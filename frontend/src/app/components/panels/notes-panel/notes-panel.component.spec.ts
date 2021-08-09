import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSidenavModule } from '@angular/material/sidenav';
import { NotesPanelComponent } from '@app/components';

describe('NotesPanelComponent', () => {
	let component: NotesPanelComponent;
	let fixture: ComponentFixture<NotesPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatSidenavModule, BrowserAnimationsModule],
			declarations: [NotesPanelComponent],
			providers: [], // Some stubs used here
			// schemas: []
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
