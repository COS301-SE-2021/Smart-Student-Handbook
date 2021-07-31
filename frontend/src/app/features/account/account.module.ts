import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/core';

import {
	AccountComponent,
	LoginComponent,
	RegisterComponent,
	RestPasswordComponent,
	ForgotPasswordComponent,
} from '@app/features/account';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AccountRoutingModule,
		MaterialModule,
	],
	declarations: [
		AccountComponent,
		LoginComponent,
		RegisterComponent,
		RestPasswordComponent,
		ForgotPasswordComponent,
	],
})
export class AccountModule {}
