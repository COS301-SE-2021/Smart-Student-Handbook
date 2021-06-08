import {LoginRequest} from "./request/LoginRequest";
import {LoginResponse} from "./response/LoginResponse";
import {RegisterRequest} from "./request/RegisterRequest";
import {RegisterResponse} from "./response/RegisterResponse";

export interface UserServiceInterface
{
	Login(request: LoginRequest): LoginResponse;

	Register(request: RegisterRequest): RegisterRequest
}