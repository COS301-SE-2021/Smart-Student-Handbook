import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComponent } from '@app/components';

describe('ConfirmDeleteComponent', () => {
	let component: ConfirmDeleteComponent;
	let fixture: ComponentFixture<ConfirmDeleteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [ConfirmDeleteComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
