/**
 * Request Data object that defines how the json object needs to be structured that is sent to the Api endpoint
 */
export class UserRequestDto {
	readonly uid: string
	readonly name?: string
	readonly institution?: string
	readonly department?: string
	readonly program?: string
	readonly workStatus?: string
	readonly bio?: string
	readonly dateJoined: string
}
