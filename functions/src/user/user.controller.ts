import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserRequestDto } from "./dto/userRequest.dto";
import { UserResponseDto } from "./dto/userResponse.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController
{
    constructor(private userService: UserService) {}

    @Get("getUserDetails/:userId")
    async getUserDetails(@Param('userId') userId): Promise<UserResponseDto>
    {
        return await this.userService.getUserDetails(userId);
    }

    @Post("createUser")
    async createUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return await this.userService.createAndUpdateUser(user);
    }

    @Post("updateUser")
    async updateUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return await this.userService.createAndUpdateUser(user,true);
    }

    @Delete("deleteUserProfile/:userId")
    async deleteUserProfile(@Param('userId') userId): Promise<UserResponseDto>
    {
        return await this.userService.deleteUserProfile(userId);
    }

}
