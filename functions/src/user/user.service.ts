import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as admin from "firebase-admin";
import firebase  from "firebase/app";
import {UserRequestDto} from "./dto/userRequest.dto";
import {User, UserResponseDto} from "./dto/userResponse.dto";

@Injectable()
export class UserService {


    async getUserDetails(uid: string): Promise<UserResponseDto>
    {
        let requestedUser: User;
        const userRef = admin.firestore().collection("users").doc(uid);
        const doc = await userRef.get();

        if(doc.exists)
        {
            requestedUser =
            {
                uid: uid,
                name:doc.data()["name"],
                institution:doc.data()["institution"],
                department:doc.data()["department"],
                program:doc.data()["program"],
                workStatus:doc.data()["workStatus"],
                bio:doc.data()["bio"],
                dateJoined:doc.data()["dateJoined"],
            }
        }
        else
        {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }

        return {success: true, message: "User was successfully found",userInfo:requestedUser};
    }

    async createAndUpdateUser(user: UserRequestDto, update: boolean = false): Promise<UserResponseDto>
    {
        const resp = await admin.firestore().collection("users").doc(user.uid).set(user);

        if (resp)
            return {success: true, message: "User was successfully added"};
        else
            throw new HttpException('An unexpected Error Occurred', HttpStatus.BAD_REQUEST);

    }

    async deleteUserProfile(userId): Promise<UserResponseDto>
    {
        return await admin.firestore().collection("users").doc(userId).delete().then(() => {
                return {
                    success: true,
                    message: "User profile was successfully deleted"
                };
        }).catch((error) => {
            throw new HttpException('An unexpected Error Occurred', HttpStatus.BAD_REQUEST);
        });
    }
}
