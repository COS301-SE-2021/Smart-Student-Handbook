import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotebookComponent } from '@app/components';

describe('AddNotebookComponent', () => {
	let component: AddNotebookComponent;
	let fixture: ComponentFixture<AddNotebookComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [AddNotebookComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AddNotebookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
