import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfirmComponent } from '@app/components';

describe('GlobalConfirmComponent', () => {
	let component: GlobalConfirmComponent;
	let fixture: ComponentFixture<GlobalConfirmComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [GlobalConfirmComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GlobalConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
