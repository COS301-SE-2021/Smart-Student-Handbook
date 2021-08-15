export interface User {
	uid: string;
	email: string;
	emailVerified: boolean;
	displayName: string;
	username: string;
	institution?: string;
	department?: string;
	program?: string;
	workStatus?: string;
	bio?: string;
	profilePicUrl?: string;
	dateJoined: DateJoined;
}

interface DateJoined {
	_seconds?: string;
	_nanoseconds?: string;
}
