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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumber = exports.validateEmail = exports.validate = void 0;
const validate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, account, passowrd } = req.body;
    let errorArray = [];
    if (!name)
        errorArray.push("Please enter your valid name");
    if (String(name).length > 20) {
        errorArray.push("Please enter valid name");
    }
    if (!account) {
        errorArray.push("Please enter your email or phone");
    }
    if (!(0, exports.validateEmail)(account) && !(0, exports.validateNumber)(account)) {
        errorArray.push("Please enter valid account or number");
    }
    if (String(passowrd).length < 6) {
        errorArray.push("Please enter a valid password which contains atleast 6 chatacters");
    }
    if (errorArray.length > 0) {
        res.status(400).send({
            status: "Invaid Request",
            error: errorArray
        });
    }
    else {
        next();
    }
});
exports.validate = validate;
const validateEmail = (account) => {
    var RegExp = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
    return RegExp.test(account);
};
exports.validateEmail = validateEmail;
const validateNumber = (account) => {
    var RegExp = /^\+?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    return RegExp.test(account);
};
exports.validateNumber = validateNumber;
