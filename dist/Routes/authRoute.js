"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = __importDefault(require("../controllers/authController"));
const validate_1 = require("../middlewares/validate");
router.post('/register', validate_1.validate, authController_1.default.register);
router.get('/activate/:active_Token', authController_1.default.activateAccount);
exports.default = router;
