export class RegisterDto {
	readonly email: string;

	readonly phoneNumber: string;

	readonly displayName: string;

	readonly password: string;

	readonly passwordConfirm?: string;
}
