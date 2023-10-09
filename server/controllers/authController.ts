import User from "../models/userModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken
} from "../config/generateToken";
import { sendMessage } from "../config/sendMessage";
import { validateEmail, validateNumber } from "../middlewares/validate";
import { sendMail } from "../config/sendMail";
import { IUser, Ideocdetoken, Itoken } from "../config/interface";
dotenv.config();

// Logic Section
const authController = {
  register: async (req: Request, res: Response) => {
    const { name, account, password } = req.body;
    try {
      const user = await User.findOne({ account });
      if (user) {
        res.status(409).json({ msg: "User already exist" });
      } else {
        const hashpassword = await bcrypt.hash(password, 12);
        const Newuser = {
          name: name,
          account: account,
          password: hashpassword,
        };
        const activetoken = generateActiveToken(Newuser);
        if (validateNumber(account)) {
          await sendMessage(
            account,
            `User account is usder process :click Here :"${process.env.URL_LINK}/activate/${activetoken}"`,
            "Imformation"
          );
          res.status(200).send({
            status: "OK",
            msg: "Check youe message to verify your account",
            active_Token: activetoken,
          });
        } else if (validateEmail(account)) {
          await sendMail(account, activetoken, "Details about account");
          res.status(200).send({
            status: "OK",
            msg: "Check your email to verify your account",
            active_Token: activetoken,
          });
        }
      }
    } catch (error:any) {
      res.status(500).send({
        message: "This is a server side error",
        Error: error.message,
      });
    }
  },

  activateAccount: async (req: Request, res: Response) => {
    try {
      // const {active_Token} = req.params;
      const { active_Token } = req.body;
      // console.log(active_Token)
      const decode = <Itoken>(
        jwt.verify(active_Token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );
        const { name, account, password } = decode;
        if (name && account && password) {
          const user = new User({
            name,
            account,
            password,
          });
          user.save().then((data) => {
            if (data) {
              res.status(200).send({ msg: "Account is activated successfully" });
            }
          });
        } else {
          res.status(200).send({ msg: "Invalid authentication" });
        }
    } catch (error:any) {
      console.log(error.message);
      res.status(500).send({
        msg: error.message
      })
    }
  },

  login:async(req:Request, res:Response)=>{
    try {
      const {account, password} = req.body
      const user = await User.findOne({account})
      if(!user){
        return res.status(400).send(
          {
            msg:"User not found"
          }
        )
      }
     loginUser(user, password, res);
    } catch (error:any) {
      return res.status(500).send({msg: error.message})
    }
  }
  ,
  logOut:async(req:Request, res:Response)=>{
     try {
      res.clearCookie('refreshtoken', {path:`api/refreshToken`})
      return res.status(200).send({msg:"Logged Out!"})
      
     } catch (error:any) {
      res.status(500).send({msg:error.message})
     }
  }
  ,
  refreshtoken:async(req:Request, res:Response)=>{
       try {
              const {refreshtoken} = req.cookies
              // console.log(refreshtoken)
              if(!refreshtoken)return res.status(400).send("Please Login now!")
              const decode = await <Ideocdetoken>jwt.verify(refreshtoken, `${process.env.REFRESH_TOKEN_SECRET}`); 
              // console.log(decode)
              if(!decode.id)return res.status(400).send("Please login Now!")
              const user = await User.findById(decode.id).select("-password")
              if(!user)return res.status(404).send({  msg: "User is does not exist" })

              const accessToken = generateAccessToken({id:user._id})
              res.status(200).send({
                msg:"Access token created successfully",
                token:accessToken
              })
       } catch (error:any) {
          res.status(500).send({
            msg:error.message
          })
       }
  }

};



const loginUser = async(user:IUser, password:string, res:Response)=>{
    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch)return res.status(500).send(
      {
        msg:"Ivalid user credintials"
      }
    )

    const accessToken = generateAccessToken({id: user._id})
    const refreshToken = generateRefreshToken({id:user._id})

    res.cookie('refreshtoken', refreshToken, {
      httpOnly:true,
      path: `api/refreshToken`,
      maxAge:30*24*60*60*1000 //30 days
    })

    res.status(200).send({
      msg:'LoggedIn Successfully',
      accessToken:accessToken,
      user:{...user._doc, password:""}
    })
}


export default authController;
