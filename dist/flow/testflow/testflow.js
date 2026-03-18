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
// import {axiospost,axiosget} from "../../function/axios";
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.post('/TEST', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------
    console.log("--TEST--");
    console.log(req.body);
    let output = {};
    let findDB = yield (0, mssql_1.mssqlquery)(`SELECT  *  FROM [SAR].[dbo].[Master_User]`);
    // console.log(findDB['']);
    try {
        if (findDB['recordsets'].length > 0) {
            console.log(findDB['recordsets']);
            output = {
                "UserName": findDB['recordsets'][0][0]['UserName'],
                "NAME": findDB['recordsets'][0][0]['Name'],
                "Section": findDB['recordsets'][0][0]['Section'],
                "Roleid": findDB['recordsets'][0][0]['Roleid'] || '1',
                "Branch": findDB['recordsets'][0][0]['Branch'],
                "return": 'OK'
            };
        }
    }
    catch (_a) {
    }
    //-------------------------------------
    //-------------------------------------
    res.json(output);
}));
router.post('/mongotest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // var output = await mongodb.insertMany("test","doc01",[{"data":2,"test":"haha"}]);
    // var output = await mongodb.find("test","doc01",{"data":2});
    // var upd = await mongodb.update("test", "doc01", { "data": 2 }, { $set: { b: 777 } });
    var output = yield (0, mongodb_1.mongodbfind)("LIMinstrument", "BALANCEdataSLUDGE", {});
    return res.json(output);
}));
router.post('/axios', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  let  output =  axiosget('https://google.com"');
    let output = {};
    yield axios_1.default.get("https://google.com")
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        output = res.data;
    }))
        .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(error.response.status);
        // output = await error.response.status;
    }));
    return res.json(output);
}));
exports.default = router;
