export interface INewUser {
    name:string,
    account:string,
    password:string
}

export interface Itoken extends INewUser{
   newUser :INewUser,
   iat:number,
   exp:number
}