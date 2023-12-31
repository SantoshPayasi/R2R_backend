import mongoose from "mongoose";
import { IUser } from "../config/interface";

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:[true, "Please addyour name"],
        trim:true,
        maxLength:[20, "Your name is up to 20 chars long."]
     },
     account:{
        type:String,
        required:[true, "Please enter your email or phone"],
        trim:true,
        unique:true
     },
     password:{
        type:String,
        required:[true, "Please add your password"],
        trim:true
     },
     avatar:{
        type:String,
        default:"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
     },
     type:{
        type:String,
        default:'normal' //fast
     },
     role:{
      type:String,
      default:'user'
     }
},
{
    timestamps:true
})

export default mongoose.model<IUser>('User', userSchema)