"use strict";
//import { BPMNClient } from './';
//import { BPMNServer, IInstanceData, IItemData } from './';
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
const dotenv = require('dotenv');
const res = dotenv.config();
console.log("Testing BPMNClient 2");
const https = require('https');
const http = require('http');
class WebService {
    constructor() { }
    invoke(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var driver = http;
            var body = JSON.stringify(params);
            console.log(options, params);
            if (options.port == 443)
                driver = https;
            let data = '';
            let self = this;
            return new Promise(function (resolve, reject) {
                try {
                    driver.request(options, function (res) {
                        console.log('STATUS: ' + res.statusCode);
                        //console.log(res);
                        self.statusCode = res.statusCode;
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            data += chunk;
                        });
                        res.on('end', () => {
                            self.result = JSON.parse(data);
                            resolve(self.result);
                        });
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                        reject(err);
                    }).end(body);
                }
                catch (exc) {
                    console.log(exc);
                }
            });
        });
    }
}
class BPMNClient extends WebService {
    constructor(host, port, apiKey) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.engine = new ClientEngine(this);
        this.datastore = new ClientDatastore(this);
        this.definitions = new ClientDefinitions(this);
    }
    get(url, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'GET', data);
        });
    }
    post(url, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'POST', data);
        });
    }
    put(url, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'PUT', data);
        });
    }
    del(url, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'DELETE', data);
        });
    }
    request(url, method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var body = JSON.stringify(params);
            var options;
            if (params) {
                options = {
                    host: this.host,
                    port: this.port,
                    path: '/api/' + url,
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": this.apiKey,
                        "Accept": "*/*",
                        //                        "User-Agent": "PostmanRuntime/ 7.26.8",
                        //                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Content-Length": Buffer.byteLength(body)
                    }
                };
            }
            else {
                options = {
                    host: this.host,
                    port: this.port,
                    path: '/api/' + url,
                    method: method
                };
            }
            return yield this.invoke(params, options);
        });
    }
}
class ClientEngine {
    constructor(client) {
        this.client = client;
    }
    start(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.post('engine/start', { name, data });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret;
            return instance;
        });
    }
    invoke(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.put('engine/invoke', { query, data });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.get('engine/get', query);
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
}
class ClientDatastore {
    constructor(client) {
        this.client = client;
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.client.get('datastore/findItems', query);
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            const items = res['items'];
            return items;
        });
    }
    findInstances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.get('datastore/findInstances', query);
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            const instances = res['instances'];
            return instances;
        });
    }
    deleteInstances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.del('datastore/delete', query);
        });
    }
}
class ClientDefinitions {
    constructor(client) {
        this.client = client;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.client.get('definitions/list', []);
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            return res;
        });
    }
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.get(encodeURI('definitions/load/' + name), { name: name });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            console.log(res);
            return res;
        });
    }
}
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const API_KEY = '12345';
        const HOST = 'test.omniworkflow.com';
        const PORT = '443';
        //    const HOST = 'localhost';
        //    const PORT = '3000';
        const BASE_URL = 'api';
        //const client = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        const client = new BPMNClient(HOST, PORT, API_KEY);
        const server = client;
        const caseId = 3040;
        var defs = yield server.definitions.list();
        console.log(defs);
        var def = yield server.definitions.load('Buy Used Car');
        console.log(def['elements']);
        //var instance = await client.engine.start("Buy Used Car", {});
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
        var insts = yield client.datastore.findInstances({ data: { caseId: caseId } });
        insts.forEach(inst => {
            console.log('Inst for CaseId id==>' + inst.id, inst.name, inst.data.caseId, 'status==>', inst.status);
        });
        var insts = yield client.datastore.findInstances({ id: instance.id });
        insts.forEach(inst => {
            for (var i = 0; i < inst.items.length; i++) {
                var item = inst.items[i];
                console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
            }
        });
        var inst = yield client.engine.get({ id: instance.id });
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
        }
        //    var items = await client.datastore.findItems({ query: { "items.elementId": "task_Buy" } });
        var items = yield client.datastore.findItems({ id: instance.id });
        items.forEach(item => {
            console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
        });
    });
}
