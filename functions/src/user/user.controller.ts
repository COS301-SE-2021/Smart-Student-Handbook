import { Controller, Get, Post, Delete, Body, Headers, Param } from '@nestjs/common';
import { UserRequestDto } from './dto/userRequest.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { UserService } from './user.service';
import { UserByUsernameDto } from './dto/userByUsername.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService, private readonly authService: AuthService) {}

	@Get('getUserByUid/:userId')
	async getUserByUid(@Param('userId') userId: string): Promise<UserResponseDto> {
		return this.userService.getUserByUid(userId);
	}

	/**
	 * Calls the user service to create a new user profile
	 * @param user - user object is sent through with all the information to create a user
	 * @param headers
	 */
	@Post('createUser')
	async createUser(@Body() user: UserRequestDto, @Headers() headers): Promise<UserResponseDto> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.userService.createUser(user, userId);
	}

	/**
	 * Calls the user service to update a user profile
	 * @param user - user object is sent through with all the information to update a user
	 * @param headers
	 */
	@Post('updateUser')
	async updateUser(@Body() user: UserRequestDto, @Headers() headers): Promise<UserResponseDto> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.userService.updateUser(user, userId);
	}

	@Delete('deleteUserProfile')
	async deleteUserProfile(@Headers() headers): Promise<UserResponseDto> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.userService.deleteUserProfile(userId);
	}

	@Post('getUserByUsername')
	getUserByUsername(@Body() userByUsername: UserByUsernameDto) {
		return this.userService.getUserByUsername(userByUsername);
	}
}
