"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../config/generateToken");
const sendMessage_1 = require("../config/sendMessage");
const validate_1 = require("../middlewares/validate");
const sendMail_1 = require("../config/sendMail");
dotenv_1.default.config();
// Logic Section 
const authController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, account, password } = req.body;
        try {
            const user = yield userModel_1.default.findOne({ account });
            if (user)
                res.status(409).json({ msg: "User already exist" });
            const hashpassword = yield bcrypt_1.default.hash(password, 12);
            const Newuser = {
                name: name,
                account: account,
                password: hashpassword,
            };
            const activetoken = (0, generateToken_1.generateActiveToken)(Newuser);
            if ((0, validate_1.validateNumber)(account)) {
                yield (0, sendMessage_1.sendMessage)(account, `User account is usder process :click Here :${process.env.URL_LINK}/api/activate/${activetoken}`, 'Imformation');
                res.status(200).send({
                    status: "OK",
                    msg: "Check youe message to verify your account"
                });
            }
            if ((0, validate_1.validateEmail)(account)) {
                yield (0, sendMail_1.sendMail)(account, activetoken, "Details about account");
                res.status(200).send({
                    status: "OK",
                    msg: "Check your email to verify your account",
                });
            }
        }
        catch (error) {
            res.status(500).send({
                message: "This is a server side error",
                Error: error,
            });
        }
    }),
    activateAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_Token } = req.params;
            // console.log(active_Token)
            const decode = jsonwebtoken_1.default.verify(active_Token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            const { name, account, password } = decode;
            const user = new userModel_1.default({
                name,
                account,
                password
            });
            user.save().then((data) => {
                if (data) {
                    res.status(200).send({ "msg": "Account is activated successfully" });
                }
            }).catch(err => {
                console.log(err);
                res.status(404).send({
                    "msg": "Something went wrong",
                    "error": err
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.default = authController;
