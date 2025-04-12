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
exports.ClientModel2 = exports.ClientData2 = exports.ClientEngine2 = exports.BPMNClient2 = void 0;
const WebService_1 = require("./WebService");
class BPMNClient2 extends WebService_1.WebService {
    constructor(host, port, apiKey) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.engine = new ClientEngine2(this);
        this.data = new ClientData2(this);
        this.model = new ClientModel2(this);
    }
    get(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'GET', params);
        });
    }
    post(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'POST', params);
        });
    }
    put(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'PUT', params);
        });
    }
    del(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(url, 'DELETE', params);
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
                    path: '/api2/' + url,
                    method: method,
                    headers: headers
                };
            }
            else {
                options = {
                    host: this.host,
                    port: this.port,
                    path: '/api2/' + url,
                    method: method
                };
            }
            return yield this.invoke(params, options);
        });
    }
}
exports.BPMNClient2 = BPMNClient2;
class ClientEngine2 {
    constructor(client) {
        this.client = client;
    }
    start(name_1) {
        return __awaiter(this, arguments, void 0, function* (name, data = {}, user, options = {}) {
            const ret = yield this.client.post('engine/start', { name, data, user, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret;
            return instance;
        });
    }
    invoke(query_1, data_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (query, data, user, options = {}) {
            console.log('invoke', options);
            const ret = yield this.client.put('engine/invoke', { query, data, user, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    assign(query, data, assignment, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.put('engine/assign', { query, data, assignment, user });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            const instance = ret['instance'];
            return instance;
        });
    }
    throwMessage(messageId_1) {
        return __awaiter(this, arguments, void 0, function* (messageId, data = {}, messageMatchingKey = {}, user, options) {
            const ret = yield this.client.post('engine/throwMessage', { "messageId": messageId, "data": data, messageMatchingKey, user, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
    throwSignal(signalId_1) {
        return __awaiter(this, arguments, void 0, function* (signalId, data = {}, messageMatchingKey = {}, user, options) {
            const ret = yield this.client.post('engine/throwSignal', { "signalId": signalId, "data": data, messageMatchingKey, user, options });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
}
exports.ClientEngine2 = ClientEngine2;
class ClientData2 {
    constructor(client) {
        this.client = client;
    }
    find(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, sort, limit, after, projection, lastItem, latestItem, getTotalCount, user }) {
            var res = yield this.client.get('datastore/find', { filter, after, limit, sort, projection, lastItem, latestItem, getTotalCount, user });
            if (res.error) {
                console.log(res.error);
                throw new Error(res.error);
                throw new Error(res['errors']);
            }
            return res;
        });
    }
    findItems(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.client.get('data/findItems', { query, user });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            const items = res['items'];
            return items;
        });
    }
    findInstances(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.get('data/findInstances', { query, user });
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            const instances = res['instances'];
            return instances;
        });
    }
    deleteInstances(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.del('data/deleteInstances', { query, user });
        });
    }
}
exports.ClientData2 = ClientData2;
class ClientModel2 {
    constructor(client) {
        this.client = client;
    }
    import(name_1, pathToBPMN_1) {
        return __awaiter(this, arguments, void 0, function* (name, pathToBPMN, pathToSVG = null, user) {
            var options = {
                'method': 'POST',
                'host': this.client.host,
                'port': this.client.port,
                'path': '/api/model/import/' + name,
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
            var res = yield this.client.get('model/list', []);
            if (res['errors']) {
                console.log(res['errors']);
                throw new Error(res['errors']);
            }
            return res;
        });
    }
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.post('model/delete/', { name });
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
            const res = yield this.client.post('model/rename/', { name, newName });
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
            const res = yield this.client.get(encodeURI('model/load/' + name), { name });
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
exports.ClientModel2 = ClientModel2;
