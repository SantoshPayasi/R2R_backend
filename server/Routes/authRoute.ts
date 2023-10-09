import express from "express";
const router = express.Router()
import authController from "../controllers/authController";
import {validate} from "../middlewares/validate";
// To register user 
router.post('/register', validate,  authController.register)
// router.get('/activate/:active_Token',   authController.activateAccount)
// To activate user account
router.post('/activate',   authController.activateAccount)
// To Login with user account
router.post('/login',   authController.login)
// LoggedOut
router.get("/logout", authController.logOut)
// Generate new refreshToken
router.get("/refreshToken", authController.refreshtoken)



export default router