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
const readline = require("readline");
const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        });
    });
};
console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();
console.log(res.parsed.PORT);
const fs = require('fs');
//raw();
const server = new _1.BPMNClient(process.env.HOST, res.parsed.PORT, process.env.API_KEY);
console.log(server);
//testMessage();
// testImport();
test1();
end();
function raw() {
    return __awaiter(this, void 0, void 0, function* () {
        var https = require('follow-redirects').https;
        var fs = require('fs');
        var options = {
            'method': 'GET',
            'hostname': 'localhost',
            'port': 3000,
            'path': '/api/datastore/findItems',
            'headers': {
                'x-api-key': '12345',
                'Content-Type': 'application/json',
                'Cookie': 'connect.sid=s%3AFJpzbs-nlVsxrhROzC_e0joMyopi6ke0.uoCjT87OZa3SOJosZxXCrC7zriAIVdMmtwcKsrY2C4I'
            },
            'maxRedirects': 20
        };
        var req = https.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
            res.on("error", function (error) {
                console.error(error);
            });
        });
        var postData = JSON.stringify({ "items.status": "end", "items.elementId": "script_task" });
        req.write(postData);
        req.end();
    });
}
function end() {
    return __awaiter(this, void 0, void 0, function* () {
        yield question("continue");
    });
}
function test1() {
    return __awaiter(this, void 0, void 0, function* () {
        var items = yield server.definitions.list();
        items.forEach(item => {
            //        console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
        });
    });
}
function testImport() {
    return __awaiter(this, void 0, void 0, function* () {
        var file = 'test-import';
        var path = '../webApp/processes/Trans.bpmn';
        var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data;filename=\"" + path + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" + fs.readFileSync(file) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        console.log(postData);
        //        var res = await upload('definitions/import/' + name, postData);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
    });
}
function testImport2() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('calling');
        var file = '../webApp/processes/Trans.bpmn';
        let response = yield server.definitions.import('testing_123', file);
        console.log(response);
    });
}
function displayInstance(instanceId) {
    return __awaiter(this, void 0, void 0, function* () {
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
function testMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const messageId = 'Message-104';
        let messageData = {};
        console.log('calling');
        let response = yield server.engine.throwMessage(messageId, messageData);
        if (response['id'])
            return yield displayInstance(response['id']);
        else
            return null;
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new _1.BPMNClient(process.env.HOST, res.parsed.PORT, process.env.API_KEY);
        const caseId = 3040;
        var delResp = yield server.datastore.deleteInstances({ name: 'Buy Used Car' });
        //console.log(delResp);
        //return;
        var defs = yield server.definitions.list();
        console.log(defs);
        var def = yield server.definitions.load('Buy Used Car');
        console.log(def['elements']);
        //var instance = await server.engine.start("Buy Used Car", {});
        var instance = yield server.engine.start("Buy Used Car", { caseId: caseId });
        console.log("instance.id", instance.id, instance.name, instance.status, instance.data.caseId);
        var response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_Buy' }, { needsCleaning: "Yes", needsRepairs: "Yes" });
        console.log('after buy', response.id, response.data);
        response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_clean' }, {});
        console.log('after clean', response.id, response.data);
        response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_repair' }, {});
        console.log('after repair', response.id, response.data);
        try {
            response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_Drive' }, {});
            console.log('after drive', response.id, response.data);
        }
        catch (exc) {
            console.log(exc);
        }
        var items = yield server.datastore.findItems({ "items.status": "end", "items.elementId": "task_Buy" });
        items.forEach(item => {
            console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
        });
        var insts = yield server.datastore.findInstances({ data: { caseId: caseId } });
        insts.forEach(inst => {
            console.log('Inst for CaseId id==>' + inst.id, inst.name, inst.data.caseId, 'status==>', inst.status);
        });
        var insts = yield server.datastore.findInstances({ id: instance.id });
        insts.forEach(inst => {
            for (var i = 0; i < inst.items.length; i++) {
                var item = inst.items[i];
                console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
            }
        });
        var inst = yield server.engine.get({ id: instance.id });
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
        }
        //    var items = await server.datastore.findItems({ query: { "items.elementId": "task_Buy" } });
        var items = yield server.datastore.findItems({ id: instance.id });
        items.forEach(item => {
            console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
        });
    });
}
function delay(time, result) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(result);
            }, time);
        });
    });
}
