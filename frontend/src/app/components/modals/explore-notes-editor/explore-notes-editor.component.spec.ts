import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNotesEditorComponent } from './explore-notes-editor.component';

describe('ExploreNotesComponent', () => {
	let component: ExploreNotesEditorComponent;
	let fixture: ComponentFixture<ExploreNotesEditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExploreNotesEditorComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExploreNotesEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
