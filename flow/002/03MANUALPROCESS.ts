import express from "express";
import { Router } from "express";
import { mssqlquery } from "../../function/mssql";
import { mssqlquery6 } from "../../function/mssql6";
import { mongodbinsertMany, mongodbfind, mongodbupdate } from "../../function/mongodb";
const SAP_MASTER = 'SAP_MASTER';
const master = 'master2';

const router: Router = express.Router();

router.post('/MANUALPROCESS/FREEQUERY', async (req, res) => {
  console.log("-----MANUALPROCESS/FREEQUERY-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['query'] !== undefined) {
      const findDB: any = await mssqlquery6(`${input['query']}`);
      output = findDB['recordsets'][0];
    }
    return res.json(output);
  } catch (err) {
    console.error('MANUALPROCESS/FREEQUERY error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/MANUALPROCESS/selecfml', async (req, res) => {
  console.log("-----MANUALPROCESS/selecfml-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['MAT'] !== undefined) {
      const db: any = await mssqlquery6(
        `SELECT * FROM [ScadaReport].[dbo].[SOI8_ProductName] WHERE [CP_Master] = @mat`,
        { mat: input['MAT'] }
      );

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

          const db2: any = await mssqlquery6(query2, { fml });
          if (db2['recordsets'].length > 0) {
            output = db2['recordsets'][0];
          }
        }
      }
    }
    return res.json(output);
  } catch (err) {
    console.error('MANUALPROCESS/selecfml error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/MANUALPROCESS/SAVEdata', async (req, res) => {
  console.log("-----MANUALPROCESS/SAVEdata-----");
  const input = req.body;

  try {
    let output: any[] = [];
    const listsetup: any[] = input['DATA'];
    if (Array.isArray(listsetup) && listsetup.length > 0) {
      const valuePlaceholders: string[] = [];
      const params: Record<string, any> = {};

      for (let i = 0; i < listsetup.length; i++) {
        valuePlaceholders.push(
          `(@NumOrder${i},@StrChemical${i},@StrLotNum${i},@StrBarcode${i},@NumStep${i},@NumSp${i},@NumAct${i})`
        );
        params[`NumOrder${i}`]    = listsetup[i]['NumOrder'];
        params[`StrChemical${i}`] = listsetup[i]['StrChemical'];
        params[`StrLotNum${i}`]   = listsetup[i]['StrLotNum'];
        params[`StrBarcode${i}`]  = listsetup[i]['StrBarcode'];
        params[`NumStep${i}`]     = listsetup[i]['NumStep'];
        params[`NumSp${i}`]       = listsetup[i]['NumSp'];
        params[`NumAct${i}`]      = listsetup[i]['NumAct'];
      }

      const query = `INSERT INTO [SOI8LOG].[dbo].[NonSCADAProcessinfo]
        ([NumOrder],[StrChemical],[StrLotNum],[StrBarcode],[NumStep],[NumSp],[NumAct])
        VALUES ${valuePlaceholders.join(',')}`;

      const db: any = await mssqlquery(query, params);
      output = db['recordsets'];
    }
    return res.json(output);
  } catch (err) {
    console.error('MANUALPROCESS/SAVEdata error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/MANUALPROCESS/SAVEADDdataSET', async (req, res) => {
  console.log("-----MANUALPROCESS/SAVEADDdataSET-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['ORDER'] !== undefined && input['CHEM'] !== undefined && input['BARCODE'] !== undefined && input['SVW'] !== undefined && input['PVW'] !== undefined) {
      const findDB: any = await mssqlquery(
        `SELECT * FROM [SAPHANADATA].[dbo].[SOI8DATAADD] WHERE [ORDER] = @order`,
        { order: input['ORDER'] }
      );
      const datass: any[] = findDB['recordsets'][0];
      if (datass.length === 0) {
        const db: any = await mssqlquery(
          `INSERT INTO [SAPHANADATA].[dbo].[SOI8DATAADD] ([ORDER],[CHEM],[BARCODE],[SVW],[PVW])
           VALUES (@order,@chem,@barcode,@svw,@pvw)`,
          {
            order:   input['ORDER'],
            chem:    input['CHEM'],
            barcode: input['BARCODE'],
            svw:     input['SVW'],
            pvw:     input['PVW'],
          }
        );
        output = db['recordsets'];
      }
    }
    return res.json(output);
  } catch (err) {
    console.error('MANUALPROCESS/SAVEADDdataSET error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/MANUALPROCESS/SAVEADDdataGET', async (req, res) => {
  console.log("-----MANUALPROCESS/SAVEADDdataGET-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['ORDER'] !== undefined) {
      const findDB: any = await mssqlquery(
        `SELECT * FROM [SAPHANADATA].[dbo].[SOI8DATAADD] WHERE [ORDER] = @order`,
        { order: input['ORDER'] }
      );
      output = findDB['recordsets'][0];
    }
    return res.json(output);
  } catch (err) {
    console.error('MANUALPROCESS/SAVEADDdataGET error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
