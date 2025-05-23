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
const _1 = require("./");
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:', process.env.HOST, process.env.PORT, process.env.API_KEY);
        const server1 = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        const res = yield server1.datastore.find({
            filter: { "items.type": "bpmn:UserTask" },
            sort: { 'items.startedAt': 1 },
            //limit:20, // limit
            projection: { id: 1, "_id": 1, name: 1, startedAt: 1, status: 1,
                "items.name": 1, "items.startedAt": 1, "items.type": 1, "items.status": 1 },
            getTotalCount: true
        });
        console.log(res.data.length, res.nextCursor, res.totalCount);
    });
}
