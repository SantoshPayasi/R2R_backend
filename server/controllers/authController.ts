import User from "../models/userModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateActiveToken,
} from "../config/generateToken";
import { sendMessage } from "../config/sendMessage";
import { validateEmail, validateNumber } from "../middlewares/validate"; 
import { sendMail } from "../config/sendMail";
import {Itoken} from '../config/interface';
dotenv.config()



// Logic Section 
const authController = {
  register: async (req: Request, res: Response) => {
    const { name, account, password } = req.body;
    try {
      const user = await User.findOne({ account });
      if (user) res.status(409).json({ msg: "User already exist" });
      const hashpassword = await bcrypt.hash(password, 12);
      const Newuser = {
        name:name,
        account: account,
        password: hashpassword,
      };
          const activetoken = generateActiveToken(Newuser);
          if(validateNumber(account)){
            await sendMessage(account, `User account is usder process :click Here :${process.env.URL_LINK}/api/activate/${activetoken}`, 'Imformation')
            res.status(200).send({
              status: "OK",
              msg: "Check youe message to verify your account"
            });
           }
           if(validateEmail(account)){
             await sendMail(account, activetoken, "Details about account")
             res.status(200).send({
              status: "OK",
              msg: "Check your email to verify your account",
            });
           }    
      
    } catch (error) {
      res.status(500).send({
        message: "This is a server side error",
        Error: error,
      });
    }
  },

  activateAccount:async (req:Request, res:Response)=>{
    try {
      const {active_Token} = req.params;
      // console.log(active_Token)
      const decode =  <Itoken>jwt.verify(active_Token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      const {name, account, password} = decode
      const user = new User({
        name,
        account,
        password
      })
      user.save().then((data)=>{
        if(data){
          res.status(200).send({"msg":"Account is activated successfully"})
        }
      }).catch(err=>{
        console.log(err)
        res.status(404).send({
          "msg":"Something went wrong",
          "error":err
        })
      })

    } catch (error) {
      console.log(error)
    }
  }
};

export default authController;
