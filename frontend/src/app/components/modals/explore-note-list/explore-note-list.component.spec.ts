import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNoteListComponent } from './explore-note-list.component';

describe('ExploreNoteListComponent', () => {
	let component: ExploreNoteListComponent;
	let fixture: ComponentFixture<ExploreNoteListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExploreNoteListComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExploreNoteListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
