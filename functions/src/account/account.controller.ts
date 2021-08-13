import { Body, Controller, Post, Get, Delete, Put, Param, Redirect } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetPasswordCodeDto } from './dto/resetPasswordCode.dto';
import { ResetPasswordFinalizeDto } from './dto/resetPasswordFinalize.dto';
import { AccountService } from './account.service';
import { Response } from './interfaces/response.interface';
import { Account } from './interfaces/account.interface';
import { VerifyEmailDto } from './dto/verifyEmail.dto';

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Post('registerUser')
	registerUser(@Body() registerDto: RegisterDto): Promise<Account> {
		return this.accountService.registerUser(registerDto);
	}

	@Post('loginUser')
	loginUser(@Body() loginDto: LoginDto): Promise<Account> {
		return this.accountService.loginUser(loginDto);
	}

	@Put('updateUser')
	updateUser(@Body() registerDto: RegisterDto): Promise<Account> {
		return this.accountService.updateUser(registerDto);
	}

	@Post('signOut')
	signOut(): Promise<Response> {
		return this.accountService.signOut();
	}

	@Get('getCurrentUser')
	getCurrentUser(): Promise<Account> {
		return this.accountService.getCurrentUser();
	}

	@Delete('deleteUser')
	deleteUser(): Promise<Response> {
		return this.accountService.deleteUser();
	}

	@Get('verifyEmail/:email/:local/:code')
	@Redirect('https://smartstudenthandbook.co.za', 308)
	verifyEmail(@Param() verifyEmailDto: VerifyEmailDto) {
		return this.accountService.verifyEmail(verifyEmailDto);
	}

	@Post('requestResetPassword')
	requestResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.accountService.requestResetPassword(resetPasswordDto);
	}

	@Get('checkResetPassword/:email/:local/:code')
	@Redirect('https://smartstudenthandbook.co.za', 308)
	async checkResetPassword(@Param() resetPasswordCodeDto: ResetPasswordCodeDto) {
		const url = await this.accountService.checkResetPassword(resetPasswordCodeDto);
		return url;
	}

	@Post('finalizeResetPassword')
	finalizeResetPassword(@Body() resetPasswordFinalizeDto: ResetPasswordFinalizeDto) {
		return this.accountService.finalizeResetPassword(resetPasswordFinalizeDto);
	}
}
