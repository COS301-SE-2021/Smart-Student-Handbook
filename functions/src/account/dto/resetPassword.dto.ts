export class ResetPasswordDto {
	readonly email: string;

	readonly password?: string;

	readonly resetCode?: string;
}
