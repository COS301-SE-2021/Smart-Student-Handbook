import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistPanelComponent } from '@app/components';

describe('SmartAssistPanelComponent', () => {
	let component: SmartAssistPanelComponent;
	let fixture: ComponentFixture<SmartAssistPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [SmartAssistPanelComponent],
			providers: [], // Some stubs used here
			// schemas: []
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
