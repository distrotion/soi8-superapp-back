import express from "express";
import { Router } from "express";
import { mssqlquery } from "../../function/mssql";
import { mongodbfind, mongodbupdate } from "../../function/mongodb";
const SAP_MASTER = 'SAP_MASTER';
const master = 'master2';

const router: Router = express.Router();

router.post('/PRODUCTIONHISTORY/FREEQUERY', async (req, res) => {
  console.log("-----PRODUCTIONHISTORY/FREEQUERY-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['query'] !== undefined) {
      const findDB: any = await mssqlquery(`${input['query']}`);
      output = findDB['recordsets'][0];
    }
    return res.json(output);
  } catch (err) {
    console.error('PRODUCTIONHISTORY/FREEQUERY error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/PRODUCTIONHISTORY/FREEQUERYM', async (req, res) => {
  console.log("-----PRODUCTIONHISTORY/FREEQUERYM-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['query'] !== undefined) {
      output = await mongodbfind(SAP_MASTER, master, input['query']);
    }
    return res.json(output);
  } catch (err) {
    console.error('PRODUCTIONHISTORY/FREEQUERYM error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/PRODUCTIONHISTORY/SETUPDATE', async (req, res) => {
  console.log("-----PRODUCTIONHISTORY/SETUPDATE-----");
  const input = req.body;

  try {
    let output: any = {};
    if (input['MKMNR'] !== undefined && input['ITEM'] !== undefined) {
      await mongodbupdate(SAP_MASTER, master, { "MKMNR": `${input['MKMNR']}` }, { $set: { "qc": `${input['ITEM']}` } });
      output = { "msg": 'OK' };
    }
    return res.json(output);
  } catch (err) {
    console.error('PRODUCTIONHISTORY/SETUPDATE error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/PRODUCTIONHISTORY/FREEQUERY6', async (req, res) => {
  console.log("-----PRODUCTIONHISTORY/FREEQUERY6-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['query'] !== undefined) {
      const findDB: any = await mssqlquery(`${input['query']}`);
      output = findDB['recordsets'][0];
    }
    return res.json(output);
  } catch (err) {
    console.error('PRODUCTIONHISTORY/FREEQUERY6 error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
