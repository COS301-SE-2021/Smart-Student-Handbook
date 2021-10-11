export class ResetPasswordFinalizeDto {
	readonly email: string;

	readonly isLocahost: boolean;

	readonly newPassword: string;

	readonly code: string;
}
