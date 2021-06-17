import { HttpException, HttpStatus,Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
import { User } from './interfaces/user.interface';
import { UserRequestDto } from "./dto/userRequest.dto";
import { UserResponseDto } from "./dto/userResponse.dto";
import firebase  from "firebase/app";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

@Injectable()
export class UserService {

    async getUserDetails(uid: string): Promise<UserResponseDto>
    {
        return null;
    }

    async createAndUpdateUser(user: UserRequestDto, update: boolean = false): Promise<UserResponseDto>
    {
        if (update)
        {
            //checkIfUserNameExists
        }

        return null;
    }

}
