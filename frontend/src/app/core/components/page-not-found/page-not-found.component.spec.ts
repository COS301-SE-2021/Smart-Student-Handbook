import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from '@app/core';

describe('PageNotFoundComponent', () => {
	let component: PageNotFoundComponent;
	let fixture: ComponentFixture<PageNotFoundComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PageNotFoundComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PageNotFoundComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
