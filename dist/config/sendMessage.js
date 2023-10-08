"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const accountSid = "ACa57e211da256664302e6b06841b67757";
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const authToken = "12b8198f6144a06c19a7422ee057ed7e";
const client = (0, twilio_1.default)(accountSid, authToken);
const sendMessage = (to, body, text) => {
    try {
        client.messages
            .create({
            body: `R2R ${text} - ${body}`,
            from: `${process.env.TWILIO_ACCOUNT_NUMBER}`,
            to: to
        })
            .then((message) => console.log(message.sid));
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendMessage = sendMessage;
