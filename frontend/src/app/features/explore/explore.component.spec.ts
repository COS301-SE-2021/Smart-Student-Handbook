import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreComponent } from '@app/features';

describe('ExploreComponent', () => {
	let component: ExploreComponent;
	let fixture: ComponentFixture<ExploreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [ExploreComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExploreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
