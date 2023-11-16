import express from "express";
import { Router } from "express";
// import mssql from "../../function/mssql";
import { mssqlquery } from "../../function/mssql";
// let mssql = require('../../function/mssql');
// import mongodb from "../../function/mongodb";
// import httpreq from "../../function/axios";
// import axios from "axios";

const router: Router = express.Router();

router.post('/INVSYSTEM/GETMASTER', async (req, res) => {
  //-------------------------------------
  console.log("-----INVSYSTEM/GETMASTER-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  // console.log(mssql.qurey())
  var findDB: any = await mssqlquery(`SELECT * FROM [SOI8_INV].[dbo].[MASTER] order by date desc`);
  let data: any = findDB['recordsets'][0];

  output = data;
  res.json(output);

});

router.post('/INVSYSTEM/GETITEM', async (req, res) => {
  //-------------------------------------
  console.log("-----INVSYSTEM/ITEM-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if (input['ZONE'] != undefined) {

    let data: any = []
    // console.log(mssql.qurey())
    var findDB1: any = await mssqlquery(`SELECT * FROM [SOI8_INV].[dbo].[${input['ZONE']}] order by date desc`);
    let data01: any = findDB1['recordsets'][0];
    var findDB2: any = await mssqlquery(`SELECT LOTNO , SUM(STOCK_C) AS TotalQuantity FROM [SOI8_INV].[dbo].[${input['ZONE']}] GROUP BY LOTNO `);
    let data02: any = findDB2['recordsets'][0];


    for (let j = 0; j < data02.length; j++) {
      for (let i = 0; i < data01.length; i++) {
        if (data02[j]['LOTNO'] === data01[i]['LOTNO']) {
          data01[i]['TotalQuantity'] = data02[j]['TotalQuantity']
          data.push(
            data01[i]
          )
          break;
        }
      }
    }



    //

    output = data;
  }
  res.json(output);

});

router.post('/INVSYSTEM/ADDITEM', async (req, res) => {
  //-------------------------------------
  console.log("-----INVSYSTEM/ADDITEM-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = {}

let timestamp = Date.now() / 1000 
console.log(timestamp);
    let data: any = []
    // console.log(mssql.qurey())
    var findDB1: any = await mssqlquery(`
    INSERT INTO [SOI8_INV].[dbo].[ZONE01] ([UID], [ITEMID], [ITEMNAME],[LOTNO],[LOCATION],[TYPE],[STOREDATE],[TIME],[STOCK_C])
    VALUES  ('${input['UID']}', '${input['ITEMID']}','${input['ITEMNAME']}','${input['LOTNO']}','${input['LOCATION']}','${input['TYPE']}',${timestamp},${timestamp},${input['STOCK_C']})
    `);
  
    //

    output = {"msg":'OK'}
  
  res.json(output);

});



export default router;

