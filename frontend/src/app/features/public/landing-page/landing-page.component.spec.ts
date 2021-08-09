import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from '@app/features/public';

describe('LandingPageComponent', () => {
	let component: LandingPageComponent;
	let fixture: ComponentFixture<LandingPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [LandingPageComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LandingPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
