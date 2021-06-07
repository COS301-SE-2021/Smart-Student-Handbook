import {LoginRequest} from "./request/LoginRequest";
import {LoginResponse} from "./response/LoginResponse";

export interface UserServiceInterface
{
	Login(request: LoginRequest): LoginResponse;
}