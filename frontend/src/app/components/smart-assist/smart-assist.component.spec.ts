import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistComponent } from './smart-assist.component';

describe('SmartAssistComponent', () => {
	let component: SmartAssistComponent;
	let fixture: ComponentFixture<SmartAssistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SmartAssistComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartAssistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
