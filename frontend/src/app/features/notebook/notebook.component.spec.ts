import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookComponent } from '@app/features';

describe('NotebookComponent', () => {
	let component: NotebookComponent;
	let fixture: ComponentFixture<NotebookComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [NotebookComponent],
			providers: [], // Some stubs used here
			// schemas: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotebookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
