import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookBottomSheetComponent } from '@app/mobile';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NotebookBottomSheetComponent', () => {
	let component: NotebookBottomSheetComponent;
	let fixture: ComponentFixture<NotebookBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [NotebookBottomSheetComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
