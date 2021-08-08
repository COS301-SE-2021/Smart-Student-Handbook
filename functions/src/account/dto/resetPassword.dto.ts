export class ResetPasswordDto {
	readonly email: string;

	readonly isLocalhost: boolean;

	readonly newPassword?: string;

	readonly code?: string;
}
