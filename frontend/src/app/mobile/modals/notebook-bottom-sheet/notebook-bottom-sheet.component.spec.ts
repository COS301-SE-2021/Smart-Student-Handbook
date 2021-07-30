import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookBottomSheetComponent } from '@app/mobile';

describe('NotebookBottomSheetComponent', () => {
	let component: NotebookBottomSheetComponent;
	let fixture: ComponentFixture<NotebookBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NotebookBottomSheetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotebookBottomSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
