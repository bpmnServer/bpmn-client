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
const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
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
        console.log('Commands:');
        console.log('	q	to quit');
        console.log('	s	start process ');
        console.log('	lo	list outstanding items');
        console.log('	l	list instances for a process');
        console.log('	di	display Instance information');
        console.log('	i	invoke item');
        console.log('	d	delete instnaces');
        let option = '';
        var command;
        while (option !== 'q') {
            command = yield question('Enter Command, q to quit\n\r>');
            let opts = command.split(' ');
            option = opts[0];
            switch (option) {
                case 'lo':
                    console.log("list outstanding items");
                    yield findItems({ "items.status": "wait" });
                    break;
                case 'l':
                    console.log("list instances");
                    yield listInstances();
                    break;
                case 'di':
                    console.log("displaying ");
                    yield displayInstance();
                    break;
                case 'i':
                    console.log("invoking");
                    yield invoke();
                    break;
                case 's':
                    console.log("starting");
                    yield start();
                    break;
                case 'd':
                    console.log("deleting");
                    yield delInstances();
                    break;
            }
        }
        console.log("bye");
        cl.close();
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide your process name: ');
        let taskData = yield question('Please provide your Task Data (json obj) if any: ');
        if (taskData === "") {
            taskData = {};
        }
        else {
            taskData = JSON.parse(taskData.toString());
        }
        let response = yield server.engine.start(name, taskData);
        console.log("Process " + name + " started:", response.items, 'InstanceId', response.id);
    });
}
function findItems(query) {
    return __awaiter(this, void 0, void 0, function* () {
        var items = yield server.datastore.findItems(query);
        console.log(items);
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            console.log(`${item.name} - ${item.elementId}	instanceId:	${item['instanceId']}`);
        }
    });
}
function listInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide your process name: ');
        let insts = yield server.datastore.findInstances({ name: name });
        for (var i = 0; i < insts.length; i++) {
            let inst = insts[i];
            console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
        }
    });
}
function displayInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceId = yield question('Please provide your Instance ID: ');
        let insts = yield server.datastore.findInstances({ id: instanceId });
        for (var i = 0; i < insts.length; i++) {
            let inst = insts[i];
            var items = inst.items;
            console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
            for (var j = 0; j < items.length; j++) {
                let item = items[j];
                console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
            }
        }
    });
}
function invoke() {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceId = yield question('Please provide your Instance ID: ');
        const taskId = yield question('Please provide your Task ID: ');
        let taskData = yield question('Please provide your Task Data (json obj) if any: ');
        if (taskData === "") {
            taskData = {};
        }
        else {
            taskData = JSON.parse(taskData.toString());
        }
        try {
            let response = yield server.engine.invoke({ id: instanceId, "items.elementId": taskId }, taskData);
            console.log("Completed UserTask:", taskId, response.items);
        }
        catch (exc) {
            console.log("Invoking task failed for:", taskId, instanceId);
            yield findItems({ id: instanceId, "items.elementId": taskId });
        }
    });
}
function delInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide process name to delete instnaces: ');
        let response = yield server.datastore.deleteInstances({ name: name });
        console.log("Instances Deleted:", response['result']['deletedCount']);
    });
}
