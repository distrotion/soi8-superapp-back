import express from "express";
import { Router } from "express";
import { mssqlquery } from "../../function/mssql";

const router: Router = express.Router();

// Validate that a ZONE value is alphanumeric/underscore only (prevents SQL injection in identifiers)
function isValidZone(zone: string): boolean {
  return /^[A-Za-z0-9_]+$/.test(zone);
}

router.post('/INVSYSTEM/GETMASTER', async (req, res) => {
  console.log("-----INVSYSTEM/GETMASTER-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['ZONE'] !== undefined) {
      if (!isValidZone(input['ZONE'])) {
        return res.status(400).json({ error: 'Invalid ZONE parameter' });
      }
      const findDB: any = await mssqlquery(
        `SELECT * FROM [SOI8_INV].[dbo].[MASTER] WHERE [ZONE] = @zone ORDER BY date DESC`,
        { zone: input['ZONE'] }
      );
      output = findDB['recordsets'][0];
    }
    return res.json(output);
  } catch (err) {
    console.error('INVSYSTEM/GETMASTER error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/INVSYSTEM/GETITEM', async (req, res) => {
  console.log("-----INVSYSTEM/ITEM-----");
  const input = req.body;

  try {
    let output: any[] = [];
    if (input['ZONE'] !== undefined) {
      if (!isValidZone(input['ZONE'])) {
        return res.status(400).json({ error: 'Invalid ZONE parameter' });
      }
      // Table name cannot be parameterized — validated via whitelist regex above
      const zone = input['ZONE'] as string;
      const findDB1: any = await mssqlquery(
        `SELECT * FROM [SOI8_INV].[dbo].[${zone}] ORDER BY date DESC`
      );
      const data01: any[] = findDB1['recordsets'][0];

      const findDB2: any = await mssqlquery(
        `SELECT LOTNO, SUM(STOCK_ALL) AS TotalQuantity FROM [SOI8_INV].[dbo].[${zone}] GROUP BY LOTNO`
      );
      const data02: any[] = findDB2['recordsets'][0];

      const data: any[] = [];
      for (let j = 0; j < data02.length; j++) {
        for (let i = 0; i < data01.length; i++) {
          if (data02[j]['LOTNO'] === data01[i]['LOTNO']) {
            data01[i]['TotalQuantity'] = data02[j]['TotalQuantity'];
            data.push(data01[i]);
            break;
          }
        }
      }
      output = data;
    }
    return res.json(output);
  } catch (err) {
    console.error('INVSYSTEM/GETITEM error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/INVSYSTEM/ADDITEM', async (req, res) => {
  console.log("-----INVSYSTEM/ADDITEM-----");
  const input = req.body;

  try {
    const timestamp = Date.now() / 1000;
    await mssqlquery(
      `INSERT INTO [SOI8_INV].[dbo].[ZONE01]
       ([UID],[ITEMID],[ITEMNAME],[LOTNO],[LOCATION],[TYPE],[STOREDATE],[TIME],[STOCK_C])
       VALUES (@uid,@itemId,@itemName,@lotNo,@location,@type,@storeDate,@time,@stockC)`,
      {
        uid: input['UID'],
        itemId: input['ITEMID'],
        itemName: input['ITEMNAME'],
        lotNo: input['LOTNO'],
        location: input['LOCATION'],
        type: input['TYPE'],
        storeDate: timestamp,
        time: timestamp,
        stockC: input['STOCK_C'],
      }
    );
    return res.json({ "msg": 'OK' });
  } catch (err) {
    console.error('INVSYSTEM/ADDITEM error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
