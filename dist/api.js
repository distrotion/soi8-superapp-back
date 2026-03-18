"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _01INVSYSTEM_1 = __importDefault(require("./flow/001/01INVSYSTEM"));
const _01PRODUCTIONHISTORY_1 = __importDefault(require("./flow/002/01PRODUCTIONHISTORY"));
const _03MANUALPROCESS_1 = __importDefault(require("./flow/002/03MANUALPROCESS"));
const _02DLINCOMING_1 = __importDefault(require("./flow/002/02DLINCOMING"));
const testflow_1 = __importDefault(require("./flow/testflow/testflow"));
const login_1 = __importDefault(require("./flow/login/login"));
//PRODUCTIONHISTORY
// import flowloginlogin from "./flow/login/login";
// import flowtestflowtestflow from "./flow/testflow/testflow";
const router = express_1.default.Router();
router.use(_01INVSYSTEM_1.default);
router.use(_01PRODUCTIONHISTORY_1.default);
router.use(testflow_1.default);
router.use(login_1.default);
router.use(_02DLINCOMING_1.default);
router.use(_03MANUALPROCESS_1.default);
// router.use(flow004flow004);
// router.use(flow005flow005);
// router.use(flowloginlogin);
// router.use(flowtestflowtestflow);
exports.default = router;
