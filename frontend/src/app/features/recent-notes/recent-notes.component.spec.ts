import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNotesComponent } from '@app/features';

describe('RecentNotesComponent', () => {
	let component: RecentNotesComponent;
	let fixture: ComponentFixture<RecentNotesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecentNotesComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecentNotesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
