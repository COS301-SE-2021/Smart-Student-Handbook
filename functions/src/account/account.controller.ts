import { Body, Controller, Post, Get, Delete, Put } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
}
