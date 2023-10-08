import  express, { response, urlencoded }  from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./Routes";
// import {connectDb }from './config/db';

dotenv.config()
// Port initilization

const port  = process.env.PORT || 5000

// Db connection
import './config/db'

// MiddleWares
const app = express();
app.use(express.json())
app.use(cors())
app.use(urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(cookieParser())

// Routes
app.use('/api', routes.authRoute)

app.get('/', (request, response)=>{
    response.json({"Message":"Hello Santosh Welcome to your blog app baackend"})
})

// Server Listening

app.listen(port, ()=>{
    console.log(`Server is listenning at ${port}`)
})
