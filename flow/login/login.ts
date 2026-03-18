import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import { mongodbfind, mongodbupdate } from "../../function/mongodb";

const router: Router = express.Router();

const Auth = 'Auth';
const user = 'user';

router.post('/login', async (req, res) => {
  const input = req.body;

  if (!input['ID'] || !input['PASS']) {
    return res.status(400).json({ "return": 'NOK' });
  }

  try {
    const findDB: any[] = await mongodbfind(Auth, user, { "ID": input['ID'] });

    if (findDB.length === 0) {
      return res.json({ "return": 'NOK' });
    }

    const stored = findDB[0];
    const storedPass: string = stored['PASS'] || '';
    const inputPass: string = input['PASS'];

    let isMatch = false;

    if (storedPass.startsWith('$2')) {
      // bcrypt hash — compare normally
      isMatch = await bcrypt.compare(inputPass, storedPass);
    } else {
      // Legacy plain-text password — compare and migrate to bcrypt
      isMatch = storedPass === inputPass;
      if (isMatch) {
        const hashed = await bcrypt.hash(inputPass, 10);
        await mongodbupdate(Auth, user, { "ID": input['ID'] }, { $set: { "PASS": hashed } });
      }
    }

    if (!isMatch) {
      return res.json({ "return": 'PASSWORD INCORRECT' });
    }

    return res.json({
      "ID": stored['ID'],
      "NAME": stored['NAME'],
      "LV": stored['LV'] || '1',
      "Section": stored['Section'],
      "Def": stored['Def'],
      "PD": stored['PD'],
      "QC": stored['QC'],
      "QA": stored['QA'] || '',
      "MFT": stored['MFT'],
      "RM": stored['RM'],
      "DL": stored['DL'],
      "return": 'OK'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ "return": 'NOK' });
  }
});

export default router;
