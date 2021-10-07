export class ResetPasswordFinalizeDto {
	readonly email: string;

	readonly isLocalhost: boolean;

	readonly newPassword: string;

	readonly code: string;
}
