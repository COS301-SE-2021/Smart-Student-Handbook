export class User{
    uid:string
    name?:string
    institution?:string
    department?:string
    program?:string
    workStatus?:string
    bio?:string
    dateJoined:string
}

export class UserResponseDto {
    success?: boolean
    message?: string
    userInfo?:User
}
