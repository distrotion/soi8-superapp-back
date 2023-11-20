import express from "express";
import { Router } from "express";
// import mssql from "../../function/mssql";
import { mssqlquery } from "../../function/mssql";
// let mssql = require('../../function/mssql');
// import mongodb from "../../function/mongodb";
// import httpreq from "../../function/axios";
// import axios from "axios";

const router: Router = express.Router();

router.post('/PRODUCTIONHISTORY/FREEQUERY', async (req, res) => {
  //-------------------------------------
  console.log("-----INVSYSTEM/GETMASTER-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if(input['query'] != undefined){

    // console.log(mssql.qurey())
    var findDB: any = await mssqlquery(`${input['query']}`);
    let data: any = findDB['recordsets'][0];
    output = data;
  }

  res.json(output);

});





export default router;

