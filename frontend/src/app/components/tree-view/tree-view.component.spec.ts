import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewComponent } from '@app/components';

describe('TreeViewComponent', () => {
	let component: TreeViewComponent;
	let fixture: ComponentFixture<TreeViewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TreeViewComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TreeViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
