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
    getUserDetails(@Param('userId') userId): Promise<UserResponseDto>
    {
        return null;
    }

    @Post("createUser")
    createUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return null;
    }

    @Post("updateUser")
    updateUser(@Body() user: UserRequestDto): Promise<UserResponseDto>
    {
        return null;
    }

}
