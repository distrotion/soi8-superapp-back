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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodbupdate = exports.mongodbfindsome = exports.mongodbfind = exports.mongodbinsertMany = void 0;
const mongodb_1 = require("mongodb");
let client = null;
function getClient() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
            client = new mongodb_1.MongoClient(url);
            yield client.connect();
        }
        return client;
    });
}
function mongodbinsertMany(db_input, collection_input, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const c = yield getClient();
        const collection = c.db(db_input).collection(collection_input);
        return collection.insertMany(input);
    });
}
exports.mongodbinsertMany = mongodbinsertMany;
function mongodbfind(db_input, collection_input, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const c = yield getClient();
        const collection = c.db(db_input).collection(collection_input);
        return collection.find(input).limit(0).sort({ "_id": -1 }).toArray();
    });
}
exports.mongodbfind = mongodbfind;
function mongodbfindsome(db_input, collection_input, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const c = yield getClient();
        const collection = c.db(db_input).collection(collection_input);
        return collection.find(input).limit(500).sort({ "_id": -1 }).project({ "PO": 1, "CP": 1, "ALL_DONE": 1 }).toArray();
    });
}
exports.mongodbfindsome = mongodbfindsome;
function mongodbupdate(db_input, collection_input, input1, input2) {
    return __awaiter(this, void 0, void 0, function* () {
        const c = yield getClient();
        const collection = c.db(db_input).collection(collection_input);
        yield collection.updateOne(input1, input2);
        return "res";
    });
}
exports.mongodbupdate = mongodbupdate;
