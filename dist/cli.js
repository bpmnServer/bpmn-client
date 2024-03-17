#!/usr/bin/env node
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
const question = function (q) {
    const cl = readline.createInterface(process.stdin, process.stdout);
    console.log(q);
    cl.setPrompt('>');
    cl.prompt();
    return new Promise((res, rej) => {
        cl.on('line', answer => {
            answer = removeBS(answer);
            res(answer);
            cl.close();
        });
    });
};
function removeBS(str) {
    if (str.indexOf('\b') === -1)
        return str;
    let l;
    while (str.indexOf('\b') > -1) {
        l = str.indexOf('\b');
        str = str.substring(0, l - 1) + str.substring(l + 1);
    }
    return str;
}
completeUserTask();
function menu() {
    console.log('Commands:');
    console.log('	q	to quit');
    console.log('	s	start process ');
    console.log('	lo	list outstanding items');
    console.log('	li	list items');
    console.log('	l	list instances for a process');
    console.log('	di	display Instance information');
    console.log('	i	Invoke Task');
    console.log('	sgl	Signal Task');
    console.log('	msg	Message Task');
    console.log('	se	Start Event');
    console.log('	rs	Restart an Instance');
    console.log('	d	delete instnaces');
    console.log('	lm	List of Models');
    console.log('	?	repeat this list');
}
function completeUserTask() {
    return __awaiter(this, void 0, void 0, function* () {
        menu();
        let option = '';
        var command;
        while (option !== 'q') {
            command = yield question('Enter Command, q to quit\n\r');
            let opts = command.split(' ');
            option = opts[0];
            switch (option) {
                case '?':
                    menu();
                    break;
                case 'lo':
                    console.log("Listing Outstanding Items");
                    yield findItems({ "items.status": "wait" });
                    break;
                case 'l':
                    console.log("Listing Instances for a Process");
                    yield listInstances();
                    break;
                case 'li':
                    console.log("list items");
                    yield listItems();
                    break;
                case 'di':
                    console.log("Displaying Instance Details");
                    yield displayInstance();
                    break;
                case 'i':
                    console.log("invoking");
                    yield invoke();
                    break;
                case 's':
                    console.log("Starting Process");
                    yield start();
                    break;
                case 'sgl':
                    console.log("Signalling Process");
                    yield signal();
                    break;
                case 'msg':
                    console.log("Message Process");
                    yield message();
                    break;
                case 'rs':
                    console.log("restarting a workflow");
                    yield restart();
                    break;
                case 'se':
                    console.log("Start Event");
                    yield startEvent();
                    break;
                case 'lm':
                    console.log("listing Models");
                    var list = yield server.definitions.list();
                    list.forEach(m => { console.log(m['name']); });
                    break;
                case 'd':
                    console.log("deleting");
                    yield delInstances();
                    break;
            }
        }
        console.log("bye");
    });
}
function getCriteria(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield question(prompt + ',in name value pair; example: items.status wait ');
        let str = '' + answer;
        if (str.trim() === '')
            return {};
        //const list = str.match(/li(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);//.match(/(?:[^\s"]+|"[^"]*")+/g);//str.split(' ');
        const list = str.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
        if ((list.length % 2) !== 0) {
            console.log("must be pairs");
            return yield getCriteria(prompt);
        }
        let criteria = {};
        console.log(list);
        for (var i = 0; i < list.length; i += 2) {
            let key = list[i];
            if (key.startsWith('"'))
                key = key.substring(1, key.length - 1);
            let val = list[i + 1];
            if (val.startsWith('"'))
                val = val.substring(1, val.length - 1);
            console.log(key, val);
            criteria[key] = val;
        }
        console.log(criteria);
        return criteria;
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide your process name: ');
        let taskData = yield getCriteria('Please provide your Task Data ');
        let response = yield server.engine.start(name, taskData);
        console.log("Process " + name + " started:", 'InstanceId', response.id);
        return yield displayInstance(response.id);
    });
}
function findItems(query) {
    return __awaiter(this, void 0, void 0, function* () {
        var items = yield server.datastore.findItems(query);
        console.log(`processName	item.name	item.elementId	instanceId	item.id`);
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            console.log(`${item['processName']}	${item.name}	${item.elementId}	${item['instanceId']}	${item.id}`);
        }
    });
}
function listItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const criteria = yield getCriteria('provide items criteria');
        var items = yield server.datastore.findItems(criteria);
        console.log(items.length);
        for (var j = 0; j < items.length; j++) {
            let item = items[j];
            console.log(`element: ${item.elementId} status: ${item.status}  processName: ${item['processName']} InstanceId: ${item['instanceId']}	id:	${item.id}`);
        }
    });
}
function listInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const criteria = yield getCriteria('provide instance criteria');
        let insts = yield server.datastore.findInstances(criteria);
        for (var i = 0; i < insts.length; i++) {
            let inst = insts[i];
            console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
        }
    });
}
function displayInstance(instanceId = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (instanceId == null)
            instanceId = yield question('Please provide your Instance ID: ');
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
        const criteria = yield getCriteria('provide item criteria');
        const taskData = yield getCriteria('provide task data');
        try {
            let response = yield server.engine.invoke(criteria, taskData);
            console.log("Completed UserTask:", criteria);
            return yield displayInstance(response.id);
        }
        catch (exc) {
            console.log("Invoking task failed for:", criteria);
        }
    });
}
function startEvent() {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceId = yield question('Please provide your Instance ID: ');
        const nodeId = yield question('Please provide start Event ID: ');
        const data = yield getCriteria('provide input data');
        try {
            let response = yield server.engine.startEvent(instanceId, nodeId, data);
            return yield displayInstance(response.id);
        }
        catch (exc) {
            console.log("Invoking task failed for:", nodeId, instanceId);
        }
    });
}
function signal() {
    return __awaiter(this, void 0, void 0, function* () {
        const signalId = yield question('Please provide signal ID: ');
        const data = yield getCriteria('provide input data');
        let response = yield server.engine.throwSignal(signalId, data);
        console.log("Signal Response:", response);
    });
}
function message() {
    return __awaiter(this, void 0, void 0, function* () {
        const messageId = yield question('Please provide message ID: ');
        const data = yield getCriteria('provide input data');
        let response = yield server.engine.throwMessage(messageId, data);
        if (response['id'])
            return yield displayInstance(response['id']);
        else {
            console.log(' no results.');
            return null;
        }
    });
}
function restart() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield getCriteria("Instance Search criteria");
        try {
            let response = yield server.engine.restart(query, {}, '');
            console.log(' Instance restarted: new Instance follows:');
            return yield displayInstance(response.id);
        }
        catch (exc) {
            console.log("Invoking task failed for:", exc);
        }
    });
}
function delInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const criteria = yield getCriteria('provide instance criteria');
        let response = yield server.datastore.deleteInstances(criteria);
        console.log("Instances Deleted:", response['result']['deletedCount']);
    });
}
