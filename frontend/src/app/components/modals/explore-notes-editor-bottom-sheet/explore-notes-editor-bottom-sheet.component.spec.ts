import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNotesEditorBottomSheetComponent } from './explore-notes-editor-bottom-sheet.component';

describe('ExploreNotesBottomSheetComponent', () => {
	let component: ExploreNotesEditorBottomSheetComponent;
	let fixture: ComponentFixture<ExploreNotesEditorBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExploreNotesEditorBottomSheetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(
			ExploreNotesEditorBottomSheetComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
