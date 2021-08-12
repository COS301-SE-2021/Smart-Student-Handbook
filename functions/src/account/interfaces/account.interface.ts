export interface Account {
	success?: boolean;
	uid: string;
	email: string;
	emailVerified: boolean;
	phoneNumber?: string;
	displayName: string;
	name?: string;
	institution?: string;
	department?: string;
	program?: string;
	workStatus?: string;
	bio?: string;
	dateJoined?: string;
	message?: string;
}
