import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComponent } from '@app/mobile';

describe('NotesComponent', () => {
	let component: NotesComponent;
	let fixture: ComponentFixture<NotesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NotesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
