import * as admin from 'firebase-admin';

export class UpdateDto {
	readonly email: string;

	readonly displayName: string;

	readonly password: string;

	readonly passwordConfirm?: string;

	readonly isLocalhost?: boolean;

	// user

	readonly username?: string;

	readonly institution?: string;

	readonly department?: string;

	readonly program?: string;

	readonly workStatus?: string;

	readonly bio?: string;

	readonly profilePicUrl?: string;

	readonly dateJoined?: admin.firestore.FieldValue;
}
