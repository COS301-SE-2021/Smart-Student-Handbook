import { Body, Controller, Post, Get, Delete, Put, Param, Redirect } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetPasswordCodeDto } from './dto/resetPasswordCode.dto';
import { ResetPasswordFinalizeDto } from './dto/resetPasswordFinalize.dto';
import { AccountService } from './account.service';
import { Response } from './interfaces/response.interface';
import { Account } from './interfaces/account.interface';

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

	@Post('requestResetPassword')
	requestResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.accountService.requestResetPassword(resetPasswordDto);
	}

	@Get('checkResetPassword/:email/:local/:code')
	@Redirect('https://smartstudentnotebook.web.app')
	checkResetPassword(@Param() resetPasswordCodeDto: ResetPasswordCodeDto) {
		return this.accountService.checkResetPassword(resetPasswordCodeDto);
	}

	@Post('finalizeResetPassword')
	finalizeResetPassword(@Body() resetPasswordFinalizeDto: ResetPasswordFinalizeDto) {
		return this.accountService.finalizeResetPassword(resetPasswordFinalizeDto);
	}
}
