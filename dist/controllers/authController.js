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
            if (user) {
                res.status(409).json({ msg: "User already exist" });
            }
            else {
                const hashpassword = yield bcrypt_1.default.hash(password, 12);
                const Newuser = {
                    name: name,
                    account: account,
                    password: hashpassword,
                };
                const activetoken = (0, generateToken_1.generateActiveToken)(Newuser);
                if ((0, validate_1.validateNumber)(account)) {
                    yield (0, sendMessage_1.sendMessage)(account, `User account is usder process :click Here :"${process.env.URL_LINK}/activate/${activetoken}"`, "Imformation");
                    res.status(200).send({
                        status: "OK",
                        msg: "Check youe message to verify your account",
                        active_Token: activetoken,
                    });
                }
                else if ((0, validate_1.validateEmail)(account)) {
                    yield (0, sendMail_1.sendMail)(account, activetoken, "Details about account");
                    res.status(200).send({
                        status: "OK",
                        msg: "Check your email to verify your account",
                        active_Token: activetoken,
                    });
                }
            }
        }
        catch (error) {
            res.status(500).send({
                message: "This is a server side error",
                Error: error.message,
            });
        }
    }),
    activateAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const {active_Token} = req.params;
            const { active_Token } = req.body;
            // console.log(active_Token)
            const decode = (jsonwebtoken_1.default.verify(active_Token, `${process.env.ACTIVE_TOKEN_SECRET}`));
            const { name, account, password } = decode;
            if (name && account && password) {
                const user = new userModel_1.default({
                    name,
                    account,
                    password,
                });
                user.save().then((data) => {
                    if (data) {
                        res.status(200).send({ msg: "Account is activated successfully" });
                    }
                });
            }
            else {
                res.status(200).send({ msg: "Invalid authentication" });
            }
        }
        catch (error) {
            console.log(error.message);
            res.status(500).send({
                msg: error.message
            });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account, password } = req.body;
            const user = yield userModel_1.default.findOne({ account });
            if (!user) {
                return res.status(400).send({
                    msg: "User not found"
                });
            }
            loginUser(user, password, res);
        }
        catch (error) {
            return res.status(500).send({ msg: error.message });
        }
    }),
    logOut: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie('refreshtoken', { path: `api/refreshToken` });
            return res.status(200).send({ msg: "Logged Out!" });
        }
        catch (error) {
            res.status(500).send({ msg: error.message });
        }
    }),
    refreshtoken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { refreshtoken } = req.cookies;
            // console.log(refreshtoken)
            if (!refreshtoken)
                return res.status(400).send("Please Login now!");
            const decode = yield jsonwebtoken_1.default.verify(refreshtoken, `${process.env.REFRESH_TOKEN_SECRET}`);
            // console.log(decode)
            if (!decode.id)
                return res.status(400).send("Please login Now!");
            const user = yield userModel_1.default.findById(decode.id).select("-password");
            if (!user)
                return res.status(404).send({ msg: "User is does not exist" });
            const accessToken = (0, generateToken_1.generateAccessToken)({ id: user._id });
            res.status(200).send({
                msg: "Access token created successfully",
                token: accessToken
            });
        }
        catch (error) {
            res.status(500).send({
                msg: error.message
            });
        }
    })
};
const loginUser = (user, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(500).send({
            msg: "Ivalid user credintials"
        });
    const accessToken = (0, generateToken_1.generateAccessToken)({ id: user._id });
    const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user._id });
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: `api/refreshToken`,
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    });
    res.status(200).send({
        msg: 'LoggedIn Successfully',
        accessToken: accessToken,
        user: Object.assign(Object.assign({}, user._doc), { password: "" })
    });
});
exports.default = authController;
