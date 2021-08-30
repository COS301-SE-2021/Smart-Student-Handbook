export class RegisterDto {
	readonly email: string;

	readonly username: string;

	readonly password: string;

	readonly passwordConfirm?: string;

	readonly isLocalhost?: boolean;
}
