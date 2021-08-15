/**
 * Response Data object that defines how the json response object is structured that is sent back from the API
 */
// eslint-disable-next-line max-classes-per-file
export class User {
	uid: string;

	displayName?: string;

	username?: string;

	institution?: string;

	department?: string;

	program?: string;

	workStatus?: string;

	bio?: string;

	profilePicUrl?: string;

	dateJoined: string;
}

export class UserResponseDto {
	success?: boolean;

	message?: string;

	user?: User;
}
