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

router.post('/MANUALPROCESS/FREEQUERY', async (req, res) => {
  //-------------------------------------
  console.log("-----MANUALPROCESS/FREEQUERY-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if (input['query'] != undefined) {

    // console.log(mssql.qurey())
    var findDB: any = await mssqlquery6(`${input['query']}`);
    let data: any = findDB['recordsets'][0];
    output = data;
  }

  res.json(output);

});


router.post('/MANUALPROCESS/selecfml', async (req, res) => {
  //-------------------------------------
  console.log("-----MANUALPROCESS/selecfml-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if (input['MAT'] != undefined) {

    let queryS = ` SELECT * FROM [ScadaReport].[dbo].[SOI8_ProductName] where [CP_Master] = '${input[`MAT`]}';`

    // console.log(mssql.qurey())
    let findDB: any = await mssqlquery6(`${queryS}`);
    let db: any = findDB;
    // output = data;

    if (db['recordsets'].length > 0) {
      let datadb = db['recordsets'][0];
      // output = datadb
      if (datadb.length > 0) {
        //Product_Name
        let FML_Name = `${datadb[0][`Product_Name`]}`.split("|")
        console.log(FML_Name)
        let query2 = `SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeCMC] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeCoil] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeGUM] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'  
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeHydro] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%' 
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeKG] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%' 
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeLQ] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeNox] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'  
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeNR] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'  
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipePM] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'  
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeRTM] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'  
union SELECT ID,Fml,Ver,A,Chm,Bc,W From [ScadaReport].[dbo].[RecipeSCM] where Fml = '${FML_Name[0]}' and Ver = '0' and Chm Not LIKE '%+%'
Order by ID ASC`

        let db: any = await mssqlquery6(`${query2}`);
        console.log(db)
        if (db['recordsets'].length > 0) {
          let datadb = db['recordsets'][0];
          output = datadb
        }
      }
    }
  }

  res.json(output);

});




router.post('/MANUALPROCESS/SAVEdata', async (req, res) => {
  //-------------------------------------
  console.log("-----MANUALPROCESS/selecfml-----");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output: any = []
  if (input['DATA'] != undefined) {

    let listsetup = input['DATA'];
    if (listsetup.length > 0) {
      let query2 = `INSERT INTO [SOI8LOG].[dbo].[NonSCADAProcessinfo] ([NumOrder],[StrChemical],[StrLotNum],[StrBarcode],[NumStep],[NumSp],[NumAct]) VALUES `;
      for (let i = 0; i < listsetup.length; i++) {
        let cooma = ``
        if(i != 0){
          cooma = ','
        }
        query2 = query2 + ` `+cooma+` ('${input['DATA'][i]['NumOrder']}','${input['DATA'][i]['StrChemical']}','${input['DATA'][i]['StrLotNum']}','${input['DATA'][i]['StrBarcode']}',${input['DATA'][i]['NumStep']},${input['DATA'][i]['NumSp']},${input['DATA'][i]['NumAct']})`

      }
      console.log(query2)
      let db: any = await mssqlquery(`${query2}`);
      output = db['recordsets'];
    }


      
  }

  res.json(output);

});



export default router;

