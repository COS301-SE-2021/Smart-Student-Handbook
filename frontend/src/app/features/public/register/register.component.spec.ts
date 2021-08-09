import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from '@app/features/public';

describe('RegisterComponent', () => {
	let component: RegisterComponent;
	let fixture: ComponentFixture<RegisterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RegisterComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RegisterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
