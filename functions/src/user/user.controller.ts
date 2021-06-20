import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserRequestDto } from "./dto/userRequest.dto";
import { UserResponseDto } from "./dto/userResponse.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController
{
    constructor(private userService: UserService) {}

    /**
     * Calls the user service to get a users details based on an ID passed in
     * @param userId
     */
    @Get("getUserDetails/:userId")
    async getUserDetails(@Param('userId') userId): Promise<UserResponseDto>
    {
        return await this.userService.getUserDetails(userId);
    }

    /**
     * Calls the user service to create a new user profile
     * @param user - user object is sent through with all the information to create a user
     */
    @Post("createUser")
    async createUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return await this.userService.createAndUpdateUser(user);
    }

    /**
     * Calls the user service to update a user profile
     * @param user - user object is sent through with all the information to update a user
     */
    @Post("updateUser")
    async updateUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return await this.userService.createAndUpdateUser(user,true);
    }

}
