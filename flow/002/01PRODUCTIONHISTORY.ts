import express from "express";
import { Router } from "express";
// import mssql from "../../function/mssql";
import { mssqlquery } from "../../function/mssql";
import { mssqlquery6 } from "../../function/mssql6";
import { mongodbinsertMany, mongodbfind, mongodbfindsome, mongodbupdate } from "../../function/mongodb";
// let mssql = require('../../function/mssql');
// import mongodb from "../../function/mongodb";
// import httpreq from "../../function/axios";
// import axios from "axios";

let SAP_MASTER = 'SAP_MASTER';
let master = 'master2';

const router: Router = express.Router();

router.post('/PRODUCTIONHISTORY/FREEQUERY', async (req, res) => {
  //-------------------------------------
  console.log("-----PRODUCTIONHISTORY/FREEQUERY-----");
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

router.post('/PRODUCTIONHISTORY/FREEQUERYM', async (req, res) => {
  //-------------------------------------
  console.log("-----PRODUCTIONHISTORY/FREEQUERYM-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if(input['query'] != undefined){

    // console.log(mssql.qurey())
    let findDB: any = await mongodbfind(SAP_MASTER,master,input['query']);
    let data: any = findDB;
    output = data;
  }

  res.json(output);

});

router.post('/PRODUCTIONHISTORY/FREEQUERY6', async (req, res) => {
  //-------------------------------------
  console.log("-----PRODUCTIONHISTORY/FREEQUERY6-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if(input['query'] != undefined){

    // console.log(mssql.qurey())
    var findDB: any = await mssqlquery6(`${input['query']}`);
    let data: any = findDB['recordsets'][0];
    output = data;
  }

  res.json(output);

});





export default router;

