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
// import mssql from "../../function/mssql";
const mssql_1 = require("../../function/mssql");
const mongodb_1 = require("../../function/mongodb");
let DLMASTER = 'DLMASTER';
let INCMASTER = 'INCMASTER';
let INCPATTERN = 'INCPATTERN';
let INCDATACHECK = 'INCDATACHECK';
const router = express_1.default.Router();
router.post('/02DLINCOMING/GETMASTER', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETMASTER-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['CODE'] != undefined) {
        // console.log(mssql.qurey())
        // let query = `SELECT * FROM [SOI8_INV].[dbo].[INCOMINGITEMSMASTER] WHERE [CODE] = '${input['CODE']}'`;
        // let findDB: any = await mssqlquery(query);
        // let data: any = findDB['recordsets'][0];
        let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCMASTER, { "CODE": input['CODE'] });
        output = findDB;
    }
    res.json(output);
}));
router.post('/02DLINCOMING/UPDATE', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/UPDATE-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "msg": 'NOK' };
    if (input['DLITEM'] != undefined && input['ITEMS'] != undefined && input['CODE'] != undefined) {
        // console.log(mssql.qurey())
        if (input['DLITEM'] != ``) {
            let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCMASTER, { "ITEMS": input['ITEMS'], "CODE": `${input['CODE']}` });
            if (findDB.length == 0) {
                let updtaed = yield (0, mongodb_1.mongodbupdate)(DLMASTER, INCMASTER, { "DLITEM": `${input['DLITEM']}` }, { $set: { "ITEMS": `${input['ITEMS']}`, "TS": Date.now() } });
                output = { "msg": 'OK' };
            }
            else {
                // let updtaed: any = await mongodbupdate(DLMASTER, INCMASTER, { "DLITEM": `${input['DLITEM']}` }, { $set: { "TYPE": `${input['TYPE']}` } });
                // output = { "msg": 'OK' }
            }
        }
        else {
            //
            let DLITEM = `DLITEMs-${Date.now()}${makeid(15)}`;
            let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCMASTER, { "ITEMS": input['ITEMS'], "CODE": `${input['CODE']}` });
            if (findDB.length == 0) {
                //
                let setdata = { "DLITEM": DLITEM, "ITEMS": `${input['ITEMS']}`, "CODE": `${input['CODE']}`, "TS": Date.now() };
                let inst = yield (0, mongodb_1.mongodbinsertMany)(DLMASTER, INCMASTER, [setdata]);
                output = { "msg": 'OK' };
            }
        }
    }
    res.json(output);
}));
router.post('/02DLINCOMING/GETPATTERN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETPATTERN-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['CODE'] != undefined) {
        // console.log(mssql.qurey())
        // let query = `SELECT * FROM [SOI8_INV].[dbo].[INCOMINGITEMSMASTER] WHERE [CODE] = '${input['CODE']}'`;
        // let findDB: any = await mssqlquery(query);
        // let data: any = findDB['recordsets'][0];
        let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "CODE": input['CODE'] });
        output = findDB;
    }
    res.json(output);
}));
router.post('/02DLINCOMING/GETPATTERNINSIDE', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETPATTERNINSIDE-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['DLPATTERN'] != undefined) {
        // console.log(mssql.qurey())
        // let query = `SELECT * FROM [SOI8_INV].[dbo].[INCOMINGITEMSMASTER] WHERE [CODE] = '${input['CODE']}'`;
        // let findDB: any = await mssqlquery(query);
        // let data: any = findDB['recordsets'][0];
        let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "DLPATTERN": input['DLPATTERN'] });
        output = findDB;
    }
    res.json(output);
}));
router.post('/02DLINCOMING/SETPATTERNINSIDE', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/SETPATTERNINSIDE-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "msg": 'NOK' };
    if (input['DLPATTERN'] != undefined && input['INCCHECKLIST'] != undefined && input['NAME'] != undefined && input['CODE'] != undefined && input['MAT'] != undefined) {
        // console.log(mssql.qurey())
        if (input['DLPATTERN'] != ``) {
            let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "NAME": input['NAME'], "CODE": `${input['CODE']}` });
            if (findDB.length == 0) {
                let updtaed = yield (0, mongodb_1.mongodbupdate)(DLMASTER, INCPATTERN, { "DLPATTERN": `${input['DLPATTERN']}` }, { $set: { "NAME": `${input['NAME']}`, "INCCHECKLIST": input['INCCHECKLIST'], "MAT": `${input['MAT']}`, "TS": Date.now() } });
                output = { "msg": 'OK' };
            }
            else {
                let updtaed = yield (0, mongodb_1.mongodbupdate)(DLMASTER, INCPATTERN, { "DLPATTERN": `${input['DLPATTERN']}` }, { $set: { "INCCHECKLIST": input['INCCHECKLIST'], "MAT": `${input['MAT']}`, "TS": Date.now() } });
                // let updtaed: any = await mongodbupdate(DLMASTER, INCMASTER, { "DLPATTERN": `${input['DLPATTERN']}` }, { $set: { "NAME3": input['INCCHECKLIST']} });
                output = { "msg": 'OK' };
            }
        }
        else {
            let DLPATTERN = `DLPATTERN-${Date.now()}${makeid(15)}`;
            let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "NAME": input['NAME'], "CODE": `${input['CODE']}` });
            if (findDB.length == 0) {
                let setdata = { "DLPATTERN": DLPATTERN, "NAME": `${input['NAME']}`, "CODE": `${input['CODE']}`, "INCCHECKLIST": input['INCCHECKLIST'], "MAT": `${input['MAT']}`, "TS": Date.now() };
                let inst = yield (0, mongodb_1.mongodbinsertMany)(DLMASTER, INCPATTERN, [setdata]);
                output = { "msg": 'OK' };
            }
        }
    }
    res.json(output);
}));
router.post('/02DLINCOMING/GETSAP', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETSAP-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    // if (input['CODE'] != undefined) {
    // console.log(mssql.qurey())
    let query = `SELECT * FROM [SOI8_INV].[dbo].[INCOMMINGFROMSAP] WHERE [status] = 'wait'`;
    let findDB = yield (0, mssql_1.mssqlquery)(query);
    let data = findDB['recordsets'][0];
    output = data;
    // }
    res.json(output);
}));
router.post('/02DLINCOMING/GETSAPsycLOT', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETSAPsycLOT-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['LOT'] != undefined) {
        // console.log(mssql.qurey())
        let findMAT = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCDATACHECK, { "LOT": input['LOT'] });
        output = findMAT;
    }
    res.json(output);
}));
router.post('/02DLINCOMING/GETSAPsycMAT', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/GETSAPsycMAT-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['MAT'] != undefined) {
        // console.log(mssql.qurey())
        let findMAT = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "MAT": input['MAT'] });
        output = findMAT;
    }
    res.json(output);
}));
router.post('/02DLINCOMING/INCOMMINGCHECKPUNIT', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("-----02DLINCOMING/INCOMMINGCHECKPUNIT-----");
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "msg": 'NOK' };
    if (input['DLPATTERN'] != undefined && input['DLITEM'] != undefined && input['TYPE'] != undefined && input['ANS'] != undefined && input['CODE'] != undefined && input['EQ'] != undefined && input['MAX'] != undefined && input['MIN'] != undefined && input['MAT'] != undefined && input['LOT'] != undefined && input['QTY'] != undefined && input['UNIT'] != undefined && input['PACKET'] != undefined && input['UNITSIZE'] != undefined && input['QTYPUNIT'] != undefined) {
        // console.log(mssql.qurey())
        let findMAT = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCDATACHECK, { "LOT": input['LOT'] });
        console.log(findMAT);
        if (findMAT.length === 0) {
            let findDB = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCPATTERN, { "MAT": input['MAT'] });
            console.log(findDB);
            //,"TS": Date.now()
            if (findDB.length > 0) {
                if (input['TYPE'] == 'A') {
                    let datains = findDB[0];
                    delete datains['_id'];
                    for (let i = 0; i < datains["INCCHECKLIST"].length; i++) {
                        if (datains["INCCHECKLIST"][i]['DLITEM'] === `${input['DLITEM']}`) {
                            if (`${input['ANS']}` === `GOOD`) {
                                datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                datains["INCCHECKLIST"][i]['TS'] = Date.now();
                            }
                            else {
                                datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                datains["INCCHECKLIST"][i]['TS'] = Date.now();
                            }
                        }
                    }
                    datains['MAT'] = `${input['MAT']}`;
                    datains['LOT'] = `${input['LOT']}`;
                    datains['QTY'] = `${input['QTY']}`;
                    datains['UNIT'] = `${input['UNIT']}`;
                    datains['PACKET'] = `${input['PACKET']}`;
                    datains['UNITSIZE'] = `${input['UNITSIZE']}`;
                    datains['MQTYPUNITAT'] = `${input['QTYPUNIT']}`;
                    let inst = yield (0, mongodb_1.mongodbinsertMany)(DLMASTER, INCDATACHECK, [datains]);
                    let outcheck = `${yield CHECKdata(`${input['LOT']}`)}`;
                    output = { "msg": 'OK', "listcheck": outcheck };
                }
                else if (input['TYPE'] == 'V') {
                    let datains = findDB[0];
                    delete datains['_id'];
                    for (let i = 0; i < datains["INCCHECKLIST"].length; i++) {
                        if (datains["INCCHECKLIST"][i]['DLITEM'] === `${input['DLITEM']}`) {
                            if (`${input['EQ']}` === `=`) {
                                let max = parseFloat(datains["INCCHECKLIST"][i]['MAX']);
                                let min = parseFloat(datains["INCCHECKLIST"][i]['MIN']);
                                let ans = parseFloat(input['ANS']);
                                if (ans >= min && ans <= max) {
                                    datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                                else {
                                    datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                                datains["INCCHECKLIST"][i]['TS'] = Date.now();
                            }
                            else if (`${input['EQ']}` === `>`) {
                                // let max:number = parseFloat( datains["INCCHECKLIST"][i]['MAX']) 
                                let min = parseFloat(datains["INCCHECKLIST"][i]['MIN']);
                                let ans = parseFloat(input['ANS']);
                                if (ans >= min) {
                                    datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                                else {
                                    datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                            }
                            else if (`${input['EQ']}` === `<`) {
                                let max = parseFloat(datains["INCCHECKLIST"][i]['MAX']);
                                // let min:number = parseFloat( datains["INCCHECKLIST"][i]['MIN']) 
                                let ans = parseFloat(input['ANS']);
                                if (ans <= max) {
                                    datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                                else {
                                    datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                    datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                                }
                            }
                        }
                    }
                    datains['MAT'] = `${input['MAT']}`;
                    datains['LOT'] = `${input['LOT']}`;
                    datains['QTY'] = `${input['QTY']}`;
                    datains['UNIT'] = `${input['UNIT']}`;
                    datains['PACKET'] = `${input['PACKET']}`;
                    datains['UNITSIZE'] = `${input['UNITSIZE']}`;
                    datains['MQTYPUNITAT'] = `${input['QTYPUNIT']}`;
                    let inst = yield (0, mongodb_1.mongodbinsertMany)(DLMASTER, INCDATACHECK, [datains]);
                    let outcheck = `${yield CHECKdata(`${input['LOT']}`)}`;
                    output = { "msg": 'OK', "listcheck": outcheck };
                }
            }
        }
        else {
            let datains = findMAT[0];
            if (input['TYPE'] == 'A') {
                for (let i = 0; i < datains["INCCHECKLIST"].length; i++) {
                    if (datains["INCCHECKLIST"][i]['DLITEM'] === `${input['DLITEM']}`) {
                        if (`${input['ANS']}` === `GOOD`) {
                            datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                            datains["INCCHECKLIST"][i]['TS'] = Date.now();
                        }
                        else {
                            datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                            datains["INCCHECKLIST"][i]['TS'] = Date.now();
                        }
                    }
                }
                let updtaed = yield (0, mongodb_1.mongodbupdate)(DLMASTER, INCDATACHECK, { "LOT": `${input['LOT']}` }, { $set: { "INCCHECKLIST": datains['INCCHECKLIST'], "TS": Date.now() } });
                let outcheck = `${yield CHECKdata(`${input['LOT']}`)}`;
                output = { "msg": 'OK', "listcheck": outcheck };
            }
            else if (input['TYPE'] == 'V') {
                for (let i = 0; i < datains["INCCHECKLIST"].length; i++) {
                    if (datains["INCCHECKLIST"][i]['DLITEM'] === `${input['DLITEM']}`) {
                        if (`${input['EQ']}` === `=`) {
                            let max = parseFloat(datains["INCCHECKLIST"][i]['MAX']);
                            let min = parseFloat(datains["INCCHECKLIST"][i]['MIN']);
                            let ans = parseFloat(input['ANS']);
                            if (ans >= min && ans <= max) {
                                datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                            else {
                                datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                            datains["INCCHECKLIST"][i]['TS'] = Date.now();
                        }
                        else if (`${input['EQ']}` === `>`) {
                            // let max:number = parseFloat( datains["INCCHECKLIST"][i]['MAX']) 
                            let min = parseFloat(datains["INCCHECKLIST"][i]['MIN']);
                            let ans = parseFloat(input['ANS']);
                            if (ans >= min) {
                                datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                            else {
                                datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                        }
                        else if (`${input['EQ']}` === `<`) {
                            let max = parseFloat(datains["INCCHECKLIST"][i]['MAX']);
                            // let min:number = parseFloat( datains["INCCHECKLIST"][i]['MIN']) 
                            let ans = parseFloat(input['ANS']);
                            if (ans <= max) {
                                datains["INCCHECKLIST"][i]['ANS'] = `GOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                            else {
                                datains["INCCHECKLIST"][i]['ANS'] = `NOGOOD`;
                                datains["INCCHECKLIST"][i]['DATA'] = input['ANS'];
                            }
                        }
                    }
                    let updtaed = yield (0, mongodb_1.mongodbupdate)(DLMASTER, INCDATACHECK, { "LOT": `${input['LOT']}` }, { $set: { "INCCHECKLIST": datains['INCCHECKLIST'], "TS": Date.now() } });
                    let outcheck = `${yield CHECKdata(`${input['LOT']}`)}`;
                    output = { "msg": 'OK', "listcheck": outcheck };
                }
            }
        }
    }
    res.json(output);
}));
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
function CHECKdata(LOT) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = 'NOK';
        let checklist = 0;
        let findMAT = yield (0, mongodb_1.mongodbfind)(DLMASTER, INCDATACHECK, { "LOT": LOT });
        if (findMAT.length > 0) {
            for (let i = 0; i < findMAT[0]["INCCHECKLIST"].length; i++) {
                if (findMAT[0]["INCCHECKLIST"][i]['ANS'] === 'GOOD') {
                    checklist++;
                }
            }
            if (findMAT[0]["INCCHECKLIST"].length === checklist) {
                output = 'OK';
            }
        }
        console.log(findMAT[0]["INCCHECKLIST"].length);
        console.log(checklist);
        console.log(output);
        return output;
    });
}
exports.default = router;
