import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserRequestDto } from "./dto/userRequest.dto";
import { UserResponseDto } from "./dto/userResponse.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController
{
    constructor(private userService: UserService) {}


}
