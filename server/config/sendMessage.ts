import twilio from "twilio";
import dotenv from 'dotenv';
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const accountSid = "ACa57e211da256664302e6b06841b67757";
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const authToken = "12b8198f6144a06c19a7422ee057ed7e";
const client = twilio(accountSid, authToken)
export const sendMessage = (to:string, body:string, text:string)=>{
    try {
        client.messages
  .create({
     body: `R2R ${text} - ${body}`,
     from: `${process.env.TWILIO_ACCOUNT_NUMBER}`,
     to: to
   })
  .then((message: { sid: any; }) => console.log(message.sid));
        
    } catch (error) {
        console.log(error)
    }
}


