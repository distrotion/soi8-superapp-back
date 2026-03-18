"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_1 = __importDefault(require("./api"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 18000;
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use('/', api_1.default);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
