import express from "express";
import { Router } from "express";
// import mssql from "../../function/mssql";
// import { mssqlquery } from "../../function/mssql";
// let mssql = require('../../function/mssql');
// import mongodb from "../../function/mongodb";
// import httpreq from "../../function/axios";
// import axios from "axios";
import { mongodbinsertMany, mongodbfind, mongodbfindsome, mongodbupdate } from "../../function/mongodb";


const router: Router = express.Router();


let Auth  = 'Auth';
let user  = 'user';

router.post('/login', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = {"return":'NOK'}
  let findDB: any = await mongodbfind(Auth,user,{"ID":input['ID']});
  console.log(findDB['PASS']);
  console.log(input['PASS']);
  if(findDB.length > 0){

      if(findDB[0]['PASS'] === input['PASS']){
          output = {
              "ID":findDB[0]['ID'],
              "NAME":findDB[0]['NAME'],
              "LV":findDB[0]['LV'] || '1',
              "Section": findDB[0]['Section'],
              "Def": findDB[0]['Def'],
              "PD": findDB[0]['PD'],
              "QC": findDB[0]['QC'],
              "QA": findDB[0]['QA']||'',
              "MFT": findDB[0]['MFT'],
              "RM": findDB[0]['RM'],
              "DL": findDB[0]['DL'],
              "return":'OK'
          }
      }else{
          output = {"return":'PASSWORD INCORRECT'}
      }

      
  }
  

  res.json(output);
});



export default router;