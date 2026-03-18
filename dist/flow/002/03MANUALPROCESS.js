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
const mssql6_1 = require("../../function/mssql6");
const SAP_MASTER = 'SAP_MASTER';
const master = 'master2';
const router = express_1.default.Router();
router.post('/MANUALPROCESS/FREEQUERY', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----MANUALPROCESS/FREEQUERY-----");
    const input = req.body;
    try {
        let output = [];
        if (input['query'] !== undefined) {
            const findDB = yield (0, mssql6_1.mssqlquery6)(`${input['query']}`);
            output = findDB['recordsets'][0];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('MANUALPROCESS/FREEQUERY error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/MANUALPROCESS/selecfml', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----MANUALPROCESS/selecfml-----");
    const input = req.body;
    try {
        let output = [];
        if (input['MAT'] !== undefined) {
            const db = yield (0, mssql6_1.mssqlquery6)(`SELECT * FROM [ScadaReport].[dbo].[SOI8_ProductName] WHERE [CP_Master] = @mat`, { mat: input['MAT'] });
            if (db['recordsets'].length > 0) {
                const datadb = db['recordsets'][0];
                if (datadb.length > 0) {
                    const FML_Name = `${datadb[0]['Product_Name']}`.split("|");
                    const fml = FML_Name[0];
                    const query2 = `
            SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeCMC]   WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeCoil]  WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeGUM]   WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeHydro] WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeKG]    WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeLQ]    WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeNox]   WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeNR]    WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipePM]    WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeRTM]   WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            UNION SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeSCM]   WHERE Fml=@fml AND Ver='0' AND Chm NOT LIKE '%+%'
            ORDER BY ID ASC`;
                    const db2 = yield (0, mssql6_1.mssqlquery6)(query2, { fml });
                    if (db2['recordsets'].length > 0) {
                        output = db2['recordsets'][0];
                    }
                }
            }
        }
        return res.json(output);
    }
    catch (err) {
        console.error('MANUALPROCESS/selecfml error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/MANUALPROCESS/SAVEdata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----MANUALPROCESS/SAVEdata-----");
    const input = req.body;
    try {
        let output = [];
        const listsetup = input['DATA'];
        if (Array.isArray(listsetup) && listsetup.length > 0) {
            const valuePlaceholders = [];
            const params = {};
            for (let i = 0; i < listsetup.length; i++) {
                valuePlaceholders.push(`(@NumOrder${i},@StrChemical${i},@StrLotNum${i},@StrBarcode${i},@NumStep${i},@NumSp${i},@NumAct${i})`);
                params[`NumOrder${i}`] = listsetup[i]['NumOrder'];
                params[`StrChemical${i}`] = listsetup[i]['StrChemical'];
                params[`StrLotNum${i}`] = listsetup[i]['StrLotNum'];
                params[`StrBarcode${i}`] = listsetup[i]['StrBarcode'];
                params[`NumStep${i}`] = listsetup[i]['NumStep'];
                params[`NumSp${i}`] = listsetup[i]['NumSp'];
                params[`NumAct${i}`] = listsetup[i]['NumAct'];
            }
            const query = `INSERT INTO [SOI8LOG].[dbo].[NonSCADAProcessinfo]
        ([NumOrder],[StrChemical],[StrLotNum],[StrBarcode],[NumStep],[NumSp],[NumAct])
        VALUES ${valuePlaceholders.join(',')}`;
            const db = yield (0, mssql_1.mssqlquery)(query, params);
            output = db['recordsets'];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('MANUALPROCESS/SAVEdata error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/MANUALPROCESS/SAVEADDdataSET', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----MANUALPROCESS/SAVEADDdataSET-----");
    const input = req.body;
    try {
        let output = [];
        if (input['ORDER'] !== undefined && input['CHEM'] !== undefined && input['BARCODE'] !== undefined && input['SVW'] !== undefined && input['PVW'] !== undefined) {
            const findDB = yield (0, mssql_1.mssqlquery)(`SELECT * FROM [SAPHANADATA].[dbo].[SOI8DATAADD] WHERE [ORDER] = @order`, { order: input['ORDER'] });
            const datass = findDB['recordsets'][0];
            if (datass.length === 0) {
                const db = yield (0, mssql_1.mssqlquery)(`INSERT INTO [SAPHANADATA].[dbo].[SOI8DATAADD] ([ORDER],[CHEM],[BARCODE],[SVW],[PVW])
           VALUES (@order,@chem,@barcode,@svw,@pvw)`, {
                    order: input['ORDER'],
                    chem: input['CHEM'],
                    barcode: input['BARCODE'],
                    svw: input['SVW'],
                    pvw: input['PVW'],
                });
                output = db['recordsets'];
            }
        }
        return res.json(output);
    }
    catch (err) {
        console.error('MANUALPROCESS/SAVEADDdataSET error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/MANUALPROCESS/SAVEADDdataGET', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-----MANUALPROCESS/SAVEADDdataGET-----");
    const input = req.body;
    try {
        let output = [];
        if (input['ORDER'] !== undefined) {
            const findDB = yield (0, mssql_1.mssqlquery)(`SELECT * FROM [SAPHANADATA].[dbo].[SOI8DATAADD] WHERE [ORDER] = @order`, { order: input['ORDER'] });
            output = findDB['recordsets'][0];
        }
        return res.json(output);
    }
    catch (err) {
        console.error('MANUALPROCESS/SAVEADDdataGET error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
