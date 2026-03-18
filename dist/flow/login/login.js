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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongodb_1 = require("../../function/mongodb");
const router = express_1.default.Router();
const Auth = 'Auth';
const user = 'user';
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    if (!input['ID'] || !input['PASS']) {
        return res.status(400).json({ "return": 'NOK' });
    }
    try {
        const findDB = yield (0, mongodb_1.mongodbfind)(Auth, user, { "ID": input['ID'] });
        if (findDB.length === 0) {
            return res.json({ "return": 'NOK' });
        }
        const stored = findDB[0];
        const storedPass = stored['PASS'] || '';
        const inputPass = input['PASS'];
        let isMatch = false;
        if (storedPass.startsWith('$2')) {
            // bcrypt hash — compare normally
            isMatch = yield bcryptjs_1.default.compare(inputPass, storedPass);
        }
        else {
            // Legacy plain-text password — compare and migrate to bcrypt
            isMatch = storedPass === inputPass;
            if (isMatch) {
                const hashed = yield bcryptjs_1.default.hash(inputPass, 10);
                yield (0, mongodb_1.mongodbupdate)(Auth, user, { "ID": input['ID'] }, { $set: { "PASS": hashed } });
            }
        }
        if (!isMatch) {
            return res.json({ "return": 'PASSWORD INCORRECT' });
        }
        return res.json({
            "ID": stored['ID'],
            "NAME": stored['NAME'],
            "LV": stored['LV'] || '1',
            "Section": stored['Section'],
            "Def": stored['Def'],
            "PD": stored['PD'],
            "QC": stored['QC'],
            "QA": stored['QA'] || '',
            "MFT": stored['MFT'],
            "RM": stored['RM'],
            "DL": stored['DL'],
            "return": 'OK'
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ "return": 'NOK' });
    }
}));
exports.default = router;
