import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBottomSheetComponent } from './chat-bottom-sheet.component';

describe('ChatBottomSheetComponent', () => {
	let component: ChatBottomSheetComponent;
	let fixture: ComponentFixture<ChatBottomSheetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ChatBottomSheetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ChatBottomSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
