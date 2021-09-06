import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from '@app/features/public';
import { MaterialModule } from '@app/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService, ResetPasswordService } from '@app/services';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ResetPasswordComponent', () => {
	let component: ResetPasswordComponent;
	let fixture: ComponentFixture<ResetPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterModule,
				FormsModule,
				MatDialogModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatSnackBarModule,
				RouterTestingModule.withRoutes([]),
				HttpClientTestingModule,
			],
			declarations: [ResetPasswordComponent],
			providers: [ResetPasswordService, AccountService], // Some stubs used here
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ResetPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
