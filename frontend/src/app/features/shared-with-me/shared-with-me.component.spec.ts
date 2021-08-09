import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithMeComponent } from './shared-with-me.component';

describe('SharedWithMeComponent', () => {
	let component: SharedWithMeComponent;
	let fixture: ComponentFixture<SharedWithMeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [SharedWithMeComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SharedWithMeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
