import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from '@app/components';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '@app/services';
import { User } from '@app/models';

describe('EditProfileComponent', () => {
	let component: EditProfileComponent;
	let fixture: ComponentFixture<EditProfileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EditProfileComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatDialogModule,
				HttpClientModule,
				RouterTestingModule.withRoutes([
					{ path: '', component: EditProfileComponent },
				]),
			],
			providers: [
				AccountService,
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
		fixture = TestBed.createComponent(EditProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
