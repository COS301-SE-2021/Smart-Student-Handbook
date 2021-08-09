import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from '@app/features';
import { MaterialModule } from '@app/core';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [HomeComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
