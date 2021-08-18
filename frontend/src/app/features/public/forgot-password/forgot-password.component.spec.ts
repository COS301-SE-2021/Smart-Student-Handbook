import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from '@app/features/public';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountService, ResetPasswordService } from '@app/services';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForgotPasswordComponent', () => {
	let component: ForgotPasswordComponent;
	let fixture: ComponentFixture<ForgotPasswordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ForgotPasswordComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			providers: [ResetPasswordService, AccountService],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ForgotPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
