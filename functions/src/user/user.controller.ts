import { Controller, Get, Post, Delete, Body, Headers } from '@nestjs/common';
import { UserRequestDto } from './dto/userRequest.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { UserService } from './user.service';
import { UserByUsernameDto } from './dto/userByUsername.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService, private readonly authService: AuthService) {}

	@Get('getUserByUid')
	async getUserByUid(@Headers() headers): Promise<UserResponseDto> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.userService.getUserByUid(userId);
	}

	/**
	 * Calls the user service to create a new user profile
	 * @param user - user object is sent through with all the information to create a user
	 */
	@Post('createUser')
	async createUser(@Body() user: UserRequestDto): Promise<UserResponseDto> {
		return this.userService.createUser(user);
	}

	/**
	 * Calls the user service to update a user profile
	 * @param user - user object is sent through with all the information to update a user
	 */
	@Post('updateUser')
	async updateUser(@Body() user: UserRequestDto): Promise<UserResponseDto> {
		return this.userService.updateUser(user);
	}

	@Delete('deleteUserProfile/:userId')
	async deleteUserProfile(@Headers() headers): Promise<UserResponseDto> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.userService.deleteUserProfile(userId);
	}

	@Post('getUserByUsername')
	getUserByUsername(@Body() userByUsername: UserByUsernameDto) {
		return this.userService.getUserByUsername(userByUsername);
	}
}
