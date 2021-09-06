import * as admin from 'firebase-admin';

export interface Account {
	success: boolean;
	user: {
		uid: string;
		email: string;
		emailVerified: boolean;
		displayName: string;
		username?: string;
		institution?: string;
		department?: string;
		program?: string;
		workStatus?: string;
		bio?: string;
		profilePicUrl?: string;
		dateJoined?: admin.firestore.FieldValue;
	};
	message?: string;
	error?: string;
	authToken?: string;
}
