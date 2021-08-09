import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from '@app/components';
import { MaterialModule } from '@app/core';

describe('EditProfileComponent', () => {
	let component: EditProfileComponent;
	let fixture: ComponentFixture<EditProfileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [EditProfileComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
