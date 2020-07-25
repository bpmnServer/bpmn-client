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
exports.Engine = exports.BPMNClient = void 0;
const http = require('http');
class BPMNClient {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.engine = new Engine(this);
        this.datastore = new Datastore(this);
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
            var options;
            var body = JSON.stringify(params);
            if (params) {
                options = {
                    host: this.host,
                    port: this.port,
                    path: '/api/' + url,
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
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
            console.log(options);
            let data = '';
            let self = this;
            return new Promise(function (resolve, reject) {
                try {
                    http.request(options, function (res) {
                        console.log('STATUS: ' + res.statusCode);
                        //          console.log('HEADERS: ' + JSON.stringify(res.headers));
                        self.statusCode = res.statusCode;
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            data += chunk;
                        });
                        res.on('end', () => {
                            //                console.log(JSON.parse(data));
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
    getItem(id) {
        if (!this.result.instance) {
            console.log(this.result);
            return;
        }
        return this.result.instance.items.filter(item => { return item.elementId == id; })[0];
    }
}
exports.BPMNClient = BPMNClient;
class Engine {
    constructor(client) {
        this.client = client;
    }
    start({ name, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.post('engine/start', { name, data });
        });
    }
    invoke({ query, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.put('engine/invoke', { query, data });
        });
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get('engine/get', query);
        });
    }
}
exports.Engine = Engine;
class Datastore {
    constructor(client) {
        this.client = client;
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get('datastore/findItems', query);
        });
    }
    findInsances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get('datastore/findInstances', query);
        });
    }
    deleteInstances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.del('datastore/delete', query);
        });
    }
}
//# sourceMappingURL=BPMNClient.js.map