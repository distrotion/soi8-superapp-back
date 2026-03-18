import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from "./api";

const app = express();
const port = Number(process.env.PORT) || 18000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/', apiRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
