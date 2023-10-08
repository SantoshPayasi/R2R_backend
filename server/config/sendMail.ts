const nodemailer = require('nodemailer')
import dotenv from 'dotenv'
import {OAuth2Client} from "google-auth-library"
dotenv.config()
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground"
const client_Id = `${process.env.MAIL_CLIENT_ID}`
// console.log("This is client id", process.env.MAIL_CLIENT_ID)
// const client_Id = "970443903082-r9omujkucu3guv3vj7a2m6e0h501o1k9.apps.googleusercontent.com"
const client_secret = `${process.env.MAIL_CLIENT_SECRET }`
// const client_secret = "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"
const Refresh_token = `${process.env.MAIL_REFRESH_TOKEN}`
// const Refresh_token = "1//04XPiV2mDHNjtCgYIARAAGAQSNwF-L9IryqiDinBYWcESRltD0NA1D_TeQcojDDlASqDUAf8_fXooejQ97vti7VeHXgPxz_Ktf20"
const sender_mail_id = `${process.env.SENDER_MAIL_ADDRESS}`
// const sender_mail_id = "spayasi78@gmail.com"


// Send mail
export const sendMail = async(to:string, url:string, txt:string) =>{
    const oAuth2Client = new OAuth2Client(
        client_Id,
        client_secret,
        OAUTH_PLAYGROUND
    )


    oAuth2Client.setCredentials({
        refresh_token:Refresh_token
    })

    try {
        const access_token = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:sender_mail_id,
                clientId:client_Id,
                clientSecret: client_secret,
                refreshToken:Refresh_token,
                access_token
            }
        })
        const mailOption = {
            from:sender_mail_id,
            to:to,
            subject:'BlogDev',
            html:`<h1>Welcome to BlogWrite</h1> : <p>Your account is under process  </p> <hr> <p>Please click over the link to activate your account</p><br> "${process.env.URL_LINK}/api/activate/${url}"`
        }

        await transport.sendMail(mailOption, (err: Error, info:any)=>{
             if(info){
                console.log(info)
             }
             if(err){
                console.log(err)
             }
        })
    } catch (error) {
        console.log(error)
    }
    
}