import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/core';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
	let component: MessageComponent;
	let fixture: ComponentFixture<MessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MessageComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatDialogModule,
			],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {
						hasBackdrop: true,
					},
				},
				{ provide: MAT_DIALOG_DATA, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
