import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistPanelComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SmartAssistPanelComponent', () => {
	let component: SmartAssistPanelComponent;
	let fixture: ComponentFixture<SmartAssistPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule, BrowserAnimationsModule],
			declarations: [SmartAssistPanelComponent],
			providers: [], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SmartAssistPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
