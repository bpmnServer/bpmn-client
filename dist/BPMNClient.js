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
exports.ClientDefinitions = exports.ClientDatastore = exports.ClientEngine = exports.BPMNClient = void 0;
const WebService_1 = require("./WebService");
class BPMNClient extends WebService_1.WebService {
    constructor(host, port, apiKey) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.engine = new ClientEngine(this);
        this.datastore = new ClientDatastore(this);
        this.definitions = new ClientDefinitions(this);
    }
    get(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, data = {}) {
            return yield this.request(url, 'GET', data);
        });
    }
    post(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, data = {}) {
            return yield this.request(url, 'POST', data);
        });
    }
    put(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, data = {}) {
            return yield this.request(url, 'PUT', data);
        });
    }
    del(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, data = {}) {
            return yield this.request(url, 'DELETE', data);
        });
    }
    request(url, method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var body = JSON.stringify(params);
            var size = Buffer.byteLength(body);
            var contentType = "application/json";
            if (method == 'UPLOAD') {
                contentType = 'multipart/form-data; boundary = ----WebKitFormBoundary7MA4YWxkTrZu0gW';
                method = 'POST';
            }
            var headers = {
                "Content-Type": contentType,
                "x-api-key": this.apiKey,
                "Accept": "*/*",
                //                        "User-Agent": "PostmanRuntime/ 7.26.8",
                //                        "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
                //,
                // "Content-Length": Buffer.byteLength(body)
            };
            var options;
            if (params) {
                options = {
                    host: this.host,
                    port: this.port,
                    path: '/api/' + url,
                    method: method,
                    headers: headers
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
exports.BPMNClient = BPMNClient;
class ClientEngine {
    constructor(client) {
        this.client = client;
    }
    start(name_1) {
        return __awaiter(this, arguments, void 0, function* (name, data = {}, startNodeId = null, userId = null, options = {}) {
            const ret = yield this.client.post('engine/start', { name, data, startNodeId, userId, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret;
            return instance;
        });
    }
    invoke(query_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (query, data, userId = null, options = {}) {
            console.log('invoke', options);
            const ret = yield this.client.put('engine/invoke', { query, data, userId, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    assign(query_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (query, data, userId = null, assignment) {
            const ret = yield this.client.put('engine/assign', { query, data, userId, assignment });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    restart(query_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (query, data, userId = null, options = {}) {
            console.log('invoke', options);
            const ret = yield this.client.put('engine/restart', { query, data, userId, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    throwMessage(messageId_1) {
        return __awaiter(this, arguments, void 0, function* (messageId, data = {}, messageMatchingKey = {}) {
            const ret = yield this.client.post('engine/throwMessage', { "messageId": messageId, "data": data, messageMatchingKey });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
    throwSignal(signalId_1) {
        return __awaiter(this, arguments, void 0, function* (signalId, data = {}, messageMatchingKey = {}) {
            const ret = yield this.client.post('engine/throwSignal', { "signalId": signalId, "data": data, messageMatchingKey });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
    startEvent(instanceId_1, startNodeId_1) {
        return __awaiter(this, arguments, void 0, function* (instanceId, startNodeId, data = {}, userId = null, options = {}) {
            const ret = yield this.client.put('engine/startEvent', { "instanceId": instanceId, "startNodeId": startNodeId, "data": data, "userName": userId, "options": options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
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
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.get('engine/status', {});
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
}
exports.ClientEngine = ClientEngine;
class ClientDatastore {
    constructor(client) {
        this.client = client;
    }
    find(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, sort, limit, after, projection, getTotalCount }) {
            var res = yield this.client.get('datastore/find', { filter, after, limit, sort, projection, getTotalCount });
            if (res.error) {
                console.log(res.error);
                throw new Error(res.error);
                throw new Error(res['errors']);
            }
            return res;
        });
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
    findInstances(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, projection = {}) {
            const res = yield this.client.get('datastore/findInstances', { query, projection });
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
            return yield this.client.del('datastore/deleteInstances', query);
        });
    }
}
exports.ClientDatastore = ClientDatastore;
class ClientDefinitions {
    constructor(client) {
        this.client = client;
    }
    import(name_1, pathToBPMN_1) {
        return __awaiter(this, arguments, void 0, function* (name, pathToBPMN, pathToSVG = null) {
            var options = {
                'method': 'POST',
                'host': this.client.host,
                'port': this.client.port,
                'path': '/api/definitions/import/' + name,
                'headers': {
                    'x-api-key': this.client.apiKey
                },
                'maxRedirects': 20
            };
            console.log('import ', name, pathToBPMN, pathToSVG);
            var res = yield this.client.upload(name, pathToBPMN, pathToSVG, options);
            console.log('import done ', res);
            this.checkErrors(res);
            return res;
        });
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
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.post('definitions/delete/', { name });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            console.log(res);
            return res;
        });
    }
    rename(name, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.post('definitions/rename/', { name, newName });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            console.log(res);
            return res;
        });
    }
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.get(encodeURI('definitions/load/' + name), { name });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            console.log(res);
            return res;
        });
    }
    checkErrors(res) {
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
    }
}
exports.ClientDefinitions = ClientDefinitions;
