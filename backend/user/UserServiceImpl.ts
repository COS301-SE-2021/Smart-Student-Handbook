import {UserServiceInterface} from "./UserServiceInterface";
import {LoginRequest} from "./request/LoginRequest";
import {LoginResponse} from "./response/LoginResponse";
import {RegisterRequest} from "./request/RegisterRequest";

export class UserServiceImpl implements UserServiceInterface
{
	Login(request: LoginRequest): LoginRequest
	{
		return null;
	}

	Register(request: RegisterRequest): RegisterRequest
	{
		return null;
	}
}

