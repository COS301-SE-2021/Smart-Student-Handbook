import {Injectable} from '@nestjs/common';
import {UserRequestDto} from "./dto/userRequest.dto";
import {UserResponseDto} from "./dto/userResponse.dto";

@Injectable()
export class UserService {


    async getUserDetails(uid: string): Promise<UserResponseDto>
    {
        return {success: false, message: "An unexpected Error Occurred"};
    }

    async createAndUpdateUser(user: UserRequestDto, update: boolean = false): Promise<UserResponseDto>
    {
        let response: UserResponseDto;

        if (update)
        {
            //checkIfUserNameExists
        }

        return {success: false, message: "An unexpected Error Occurred"};
    }

}
