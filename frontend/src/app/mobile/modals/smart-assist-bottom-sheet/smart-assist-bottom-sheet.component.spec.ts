import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistBottomSheetComponent } from './smart-assist-bottom-sheet.component';

describe('SmartAssistBottomSheetComponent', () => {
	let component: SmartAssistBottomSheetComponent;
	let fixture: ComponentFixture<SmartAssistBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SmartAssistBottomSheetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartAssistBottomSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
