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
const router = express_1.default.Router();
// Validate that a ZONE value is alphanumeric/underscore only (prevents SQL injection in identifiers)
function isValidZone(zone) {
    return /^[A-Za-z0-9_]+$/.test(zone);
}
router.post('/INVSYSTEM/GETMASTER', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----INVSYSTEM/GETMASTER-----");
    const input = req.body;
    try {
        let output = [];
        if (input['ZONE'] !== undefined) {
            if (!isValidZone(input['ZONE'])) {
                return res.status(400).json({ error: 'Invalid ZONE parameter' });
            }
            const findDB = yield (0, mssql_1.mssqlquery)(`SELECT * FROM [SOI8_INV].[dbo].[MASTER] WHERE [ZONE] = @zone ORDER BY date DESC`, { zone: input['ZONE'] });
            output = findDB['recordsets'][0];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('INVSYSTEM/GETMASTER error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/INVSYSTEM/GETITEM', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----INVSYSTEM/ITEM-----");
    const input = req.body;
    try {
        let output = [];
        if (input['ZONE'] !== undefined) {
            if (!isValidZone(input['ZONE'])) {
                return res.status(400).json({ error: 'Invalid ZONE parameter' });
            }
            // Table name cannot be parameterized — validated via whitelist regex above
            const zone = input['ZONE'];
            const findDB1 = yield (0, mssql_1.mssqlquery)(`SELECT * FROM [SOI8_INV].[dbo].[${zone}] ORDER BY date DESC`);
            const data01 = findDB1['recordsets'][0];
            const findDB2 = yield (0, mssql_1.mssqlquery)(`SELECT LOTNO, SUM(STOCK_ALL) AS TotalQuantity FROM [SOI8_INV].[dbo].[${zone}] GROUP BY LOTNO`);
            const data02 = findDB2['recordsets'][0];
            const data = [];
            for (let j = 0; j < data02.length; j++) {
                for (let i = 0; i < data01.length; i++) {
                    if (data02[j]['LOTNO'] === data01[i]['LOTNO']) {
                        data01[i]['TotalQuantity'] = data02[j]['TotalQuantity'];
                        data.push(data01[i]);
                        break;
                    }
                }
            }
            output = data;
        }
        return res.json(output);
    }
    catch (err) {
        console.error('INVSYSTEM/GETITEM error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/INVSYSTEM/ADDITEM', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----INVSYSTEM/ADDITEM-----");
    const input = req.body;
    try {
        const timestamp = Date.now() / 1000;
        yield (0, mssql_1.mssqlquery)(`INSERT INTO [SOI8_INV].[dbo].[ZONE01]
       ([UID],[ITEMID],[ITEMNAME],[LOTNO],[LOCATION],[TYPE],[STOREDATE],[TIME],[STOCK_C])
       VALUES (@uid,@itemId,@itemName,@lotNo,@location,@type,@storeDate,@time,@stockC)`, {
            uid: input['UID'],
            itemId: input['ITEMID'],
            itemName: input['ITEMNAME'],
            lotNo: input['LOTNO'],
            location: input['LOCATION'],
            type: input['TYPE'],
            storeDate: timestamp,
            time: timestamp,
            stockC: input['STOCK_C'],
        });
        return res.json({ "msg": 'OK' });
    }
    catch (err) {
        console.error('INVSYSTEM/ADDITEM error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
