import {Body, Controller, Post, Get} from '@nestjs/common';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AccountService } from "./account.service";

@Controller('account')
export class AccountController {

	constructor(private readonly accountService : AccountService) {}

	@Post("registerUser")
	registerUser(@Body() registerDto: RegisterDto): Promise<string>
	{
		return this.accountService.registerUser(registerDto);
	}

	@Post("loginUser")
	loginUser(@Body() loginDto: LoginDto): Promise<string>
	{
		return this.accountService.loginUser(loginDto);
	}

	@Post("updateUser")
	updateUser(@Body() registerDto: RegisterDto): Promise<string>
	{
		return this.accountService.updateUser(registerDto);
	}

	@Post("signOut")
	signOut(): Promise<string>
	{
		return this.accountService.signOut();
	}

	@Get("getCurrentUser")
	getCurrentUser(): Promise<string>
	{
		return this.accountService.getCurrentUser();
	}
}
