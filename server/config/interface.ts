import {Document} from 'mongoose'

export interface IUser extends Document{
    name:string,
    account:string,
    password:string,
    avatar:string,
    type:string,
    role:string,
    _doc:object
}

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


export interface Ideocdetoken{
    id?:string,
    iat:number,
    exp:number
}