import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from '@app/features';

describe('NotificationsComponent', () => {
	let component: NotificationsComponent;
	let fixture: ComponentFixture<NotificationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [NotificationsComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
