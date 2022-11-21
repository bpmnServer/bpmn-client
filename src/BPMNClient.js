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
console.log("BPMNClient 1.2");
const https = require('https');
const http = require('http');
const fs = require("fs");
class WebService {
    constructor() { }
    invoke(params, options, postData = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var driver = http;
            var body = JSON.stringify(params);
            //        console.log(options, params);
            if (options.port == 443)
                driver = https;
            let data = '';
            let self = this;
            return new Promise(function (resolve, reject) {
                try {
                    var req = driver.request(options, function (res) {
                        //                    console.log('STATUS: ' + res.statusCode);
                        this.response = res;
                        //console.log(res);
                        self.statusCode = res.statusCode;
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            data += chunk;
                        });
                        res.on('end', () => {
                            try {
                                self.result = JSON.parse(data);
                                resolve(self.result);
                            }
                            catch (exc) {
                                console.log(data);
                                console.log(exc);
                            }
                        });
                    });
                    req.on("error", (err) => {
                        console.log("Error: " + err.message);
                        reject(err);
                    });
                    if (postData !== null)
                        req.write(postData);
                    req.end(body);
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
    upload(url, fileName, path) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('upload');
            var options = {
                'method': 'POST',
                'hostname': this.host,
                'port': this.port,
                'path': url + '/' + fileName,
                'headers': {
                    'x-api-key': this.apiKey
                },
                'maxRedirects': 20
            };
            var req = http.request(options, function (res) {
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
            var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
                + fileName + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" +
                fs.readFileSync(path) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
            req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
            req.write(postData);
            req.end();
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
    start(name, data = {}, startNodeId = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.post('engine/start', { name, data, startNodeId, options });
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
    throwMessage(messageId, data = {}, messageMatchingKey = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.post('engine/throwMessage', { "messageId": messageId, "data": data, messageMatchingKey });
            if (ret['errors']) {
                console.log(ret['errors']);
                throw new Error(ret['errors']);
            }
            return ret;
        });
    }
    throwSignal(signalId, data = {}, messageMatchingKey = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.client.post('engine/throwSignal', { "signalId": signalId, "data": data, messageMatchingKey });
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
            return yield this.client.del('datastore/deleteInstances', query);
        });
    }
}
exports.ClientDatastore = ClientDatastore;
class ClientDefinitions {
    constructor(client) {
        this.client = client;
    }
    import(name, path) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.client.upload('definitions/import', name, path);
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
}
exports.ClientDefinitions = ClientDefinitions;
