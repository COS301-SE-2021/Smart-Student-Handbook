import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from '@app/components';
import { MaterialModule } from '@app/core';

describe('EditorComponent', () => {
	let component: EditorComponent;
	let fixture: ComponentFixture<EditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule],
			declarations: [EditorComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
