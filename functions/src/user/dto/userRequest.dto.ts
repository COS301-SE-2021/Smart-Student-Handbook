/**
 * Request Data object that defines how the json object needs to be structured that is sent to the Api endpoint
 */
import * as admin from 'firebase-admin';

export class UserRequestDto {
	readonly uid: string;

	readonly username?: string;

	readonly institution?: string;

	readonly department?: string;

	readonly program?: string;

	readonly workStatus?: string;

	readonly bio?: string;

	readonly profilePicUrl?: string;

	readonly dateJoined?: admin.firestore.FieldValue;
}
