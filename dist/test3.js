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
//import { BPMNClient } from "bpmn-client";
const _1 = require("./");
const readline = require("readline");
const dotenv = require('dotenv');
const res = dotenv.config();
const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        });
    });
};
completeUserTask();
function completeUserTask() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        const instanceId = yield question('Please provide your Instance ID: ');
        const taskId = yield question('Please provide your Task ID: ');
        let taskData = yield question('Please provide your Task Data (json obj) if any: ');
        cl.close();
        if (taskData === "") {
            taskData = {};
        }
        else {
            taskData = JSON.parse(taskData.toString());
        }
        yield server.engine.invoke({ id: instanceId, "items.elementId": taskId }, taskData);
        console.log("Completed UserTask:", taskId);
    });
}
