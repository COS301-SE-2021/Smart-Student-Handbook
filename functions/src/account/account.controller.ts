import { Body, Controller, Post, Get, Delete, Put, Param, Redirect, Headers } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ResetPasswordCodeDto } from './dto/resetPasswordCode.dto';
import { ResetPasswordFinalizeDto } from './dto/resetPasswordFinalize.dto';
import { AccountService } from './account.service';
import { Response } from './interfaces/response.interface';
import { Account } from './interfaces/account.interface';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthService } from '../auth/auth.service';

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService, private readonly authService: AuthService) {}

	@Post('registerUser')
	registerUser(@Body() registerDto: RegisterDto): Promise<Account> {
		return this.accountService.registerUser(registerDto);
	}

	@Post('loginUser')
	loginUser(@Body() loginDto: LoginDto): Promise<Account> {
		return this.accountService.loginUser(loginDto);
	}

	@Put('updateUser')
	async updateUser(@Body() updateDto: UpdateDto, @Headers() headers): Promise<Account> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.accountService.updateUser(updateDto, userId);
	}

	@Post('signOut')
	signOut(): Promise<Response> {
		return this.accountService.signOut();
	}

	@Get('getCurrentUser')
	async getCurrentUser(@Headers() headers): Promise<Account> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.accountService.getCurrentUser(userId);
	}

	@Delete('deleteUser')
	async deleteUser(@Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.accountService.deleteUser(userId);
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

	@Post('setUserNotificationToken')
	async setUserNotificationToken(@Headers() headers, @Body('notificationToken') notificationToken: string) {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.accountService.setUserNotificationToken(userId, notificationToken);
	}

	// @Post('refreshIdToken/:userId')
	// async refreshIdToken(@Headers() headers) {
	// 	const userId: string = await this.authService.verifyUser(headers.token);
	// 	return this.accountService.refreshIdToken(userId);
	// }
}
