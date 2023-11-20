import express from "express";
import { Router } from "express";
import INVSYSTEM from "./flow/001/01INVSYSTEM";
import PRODUCTIONHISTORY from "./flow/002/01PRODUCTIONHISTORY";
import testflow from "./flow/testflow/testflow";
import login from "./flow/login/login";


//PRODUCTIONHISTORY

// import flowloginlogin from "./flow/login/login";
// import flowtestflowtestflow from "./flow/testflow/testflow";

const router: Router = express.Router();
router.use(INVSYSTEM);
router.use(PRODUCTIONHISTORY);
router.use(testflow);
router.use(login);
// router.use(flow004flow004);
// router.use(flow005flow005);
// router.use(flowloginlogin);
// router.use(flowtestflowtestflow);

export default router;