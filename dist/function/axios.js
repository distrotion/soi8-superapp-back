"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosget = exports.axiospost = void 0;
const axios_1 = __importDefault(require("axios"));
function axiospost(url, body) {
    return __awaiter(this, void 0, void 0, function* () {
        let output;
        yield axios_1.default.post(url, body)
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            output = res.data;
        }))
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            console.error(error.response.status);
            output = yield error.response.status;
        }));
        return output;
    });
}
exports.axiospost = axiospost;
;
function axiosget(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let output;
        yield axios_1.default.get(url)
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            output = res.data;
        }))
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            console.error(error.response.status);
            output = yield error.response.status;
        }));
        return output;
    });
}
exports.axiosget = axiosget;
;
