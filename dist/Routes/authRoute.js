"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = __importDefault(require("../controllers/authController"));
const validate_1 = require("../middlewares/validate");
// To register user 
router.post('/register', validate_1.validate, authController_1.default.register);
// router.get('/activate/:active_Token',   authController.activateAccount)
// To activate user account
router.post('/activate', authController_1.default.activateAccount);
// To Login with user account
router.post('/login', authController_1.default.login);
// LoggedOut
router.get("/logout", authController_1.default.logOut);
// Generate new refreshToken
router.get("/refreshToken", authController_1.default.refreshtoken);
exports.default = router;
