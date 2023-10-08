import express from "express";
const router = express.Router()
import authController from "../controllers/authController";
import {validate} from "../middlewares/validate";
router.post('/register', validate,  authController.register)
// router.get('/activate/:active_Token',   authController.activateAccount)
router.post('/activate',   authController.activateAccount)

export default router