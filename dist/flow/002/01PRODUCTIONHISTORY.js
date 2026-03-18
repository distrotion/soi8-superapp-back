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
const mssql_1 = require("../../function/mssql");
const mongodb_1 = require("../../function/mongodb");
const auth_1 = require("../../middleware/auth");
const SAP_MASTER = 'SAP_MASTER';
const master = 'master2';
const router = express_1.default.Router();
// FREEQUERY endpoints execute raw SQL — protected by API key
router.post('/PRODUCTIONHISTORY/FREEQUERY', auth_1.requireApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----PRODUCTIONHISTORY/FREEQUERY-----");
    const input = req.body;
    try {
        let output = [];
        if (input['query'] !== undefined) {
            const findDB = yield (0, mssql_1.mssqlquery)(`${input['query']}`);
            output = findDB['recordsets'][0];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('PRODUCTIONHISTORY/FREEQUERY error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/PRODUCTIONHISTORY/FREEQUERYM', auth_1.requireApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----PRODUCTIONHISTORY/FREEQUERYM-----");
    const input = req.body;
    try {
        let output = [];
        if (input['query'] !== undefined) {
            output = yield (0, mongodb_1.mongodbfind)(SAP_MASTER, master, input['query']);
        }
        return res.json(output);
    }
    catch (err) {
        console.error('PRODUCTIONHISTORY/FREEQUERYM error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/PRODUCTIONHISTORY/SETUPDATE', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----PRODUCTIONHISTORY/SETUPDATE-----");
    const input = req.body;
    try {
        let output = {};
        if (input['MKMNR'] !== undefined && input['ITEM'] !== undefined) {
            yield (0, mongodb_1.mongodbupdate)(SAP_MASTER, master, { "MKMNR": `${input['MKMNR']}` }, { $set: { "qc": `${input['ITEM']}` } });
            output = { "msg": 'OK' };
        }
        return res.json(output);
    }
    catch (err) {
        console.error('PRODUCTIONHISTORY/SETUPDATE error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/PRODUCTIONHISTORY/FREEQUERY6', auth_1.requireApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----PRODUCTIONHISTORY/FREEQUERY6-----");
    const input = req.body;
    try {
        let output = [];
        if (input['query'] !== undefined) {
            const findDB = yield (0, mssql_1.mssqlquery)(`${input['query']}`);
            output = findDB['recordsets'][0];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('PRODUCTIONHISTORY/FREEQUERY6 error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
