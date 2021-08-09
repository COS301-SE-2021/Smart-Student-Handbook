import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalErrorComponent } from '@app/components';

describe('GlobalErrorComponent', () => {
	let component: GlobalErrorComponent;
	let fixture: ComponentFixture<GlobalErrorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [GlobalErrorComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GlobalErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
