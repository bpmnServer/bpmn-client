import { WebService } from './WebService.js';
class BPMNClient2 extends WebService {
    host;
    port;
    apiKey;
    basePath;
    accessToken;
    engine;
    data;
    constructor(host, port, apiKey, basePath = '/api2/', accessToken = null) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.basePath = basePath;
        this.accessToken = accessToken;
        this.engine = new ClientEngine2(this);
        this.data = new ClientData2(this);
    }
    async get(url, params) {
        return await this.request(url, 'GET', params);
    }
    async post(url, params) {
        return await this.request(url, 'POST', params);
    }
    async put(url, params) {
        return await this.request(url, 'PUT', params);
    }
    async del(url, params) {
        return await this.request(url, 'DELETE', params);
    }
    async request(url, method, params) {
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
        if (this.accessToken)
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        var options;
        if (params) {
            options = {
                host: this.host,
                port: this.port,
                path: this.basePath + url,
                method: method,
                headers: headers
            };
        }
        else {
            options = {
                host: this.host,
                port: this.port,
                path: this.basePath + url,
                method: method
            };
        }
        return await this.invoke(params, options);
    }
}
class ClientEngine2 {
    client;
    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, options = {}) {
        const ret = await this.client.post('engine/start', { name, data, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret;
        return instance;
    }
    async invoke(query, data, options = {}) {
        const ret = await this.client.put('engine/invoke', { query, data, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async assign(query, data, assignment) {
        const ret = await this.client.put('engine/assign', { query, data, assignment });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'];
        return instance;
    }
    async restart(query, data = {}, options = {}) {
        const ret = await this.client.put('engine/restart', { query, data, options });
        if (ret['errors'])
            throw new Error(ret['errors']);
        return ret['instance'];
    }
    async get(query) {
        const ret = await this.client.get('engine/get', { query });
        if (ret['errors'])
            throw new Error(ret['errors']);
        return ret['instance'];
    }
    async throwMessage(messageId, data = {}, messageMatchingKey = {}, options = {}) {
        const ret = await this.client.post('engine/throwMessage', { messageId, data, messageMatchingKey, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async throwSignal(signalId, data = {}, messageMatchingKey = {}, options = {}) {
        const ret = await this.client.post('engine/throwSignal', { signalId, data, messageMatchingKey, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
}
class ClientData2 {
    client;
    constructor(client) {
        this.client = client;
    }
    async find({ filter, sort, limit, after, projection, lastItem, latestItem, getTotalCount }) {
        var res = await this.client.get('datastore/find', { filter, after, limit, sort, projection, lastItem, latestItem, getTotalCount });
        if (res.error) {
            console.log(res.error);
            throw new Error(res.error);
            throw new Error(res['errors']);
        }
        return res;
    }
    async findItems(query) {
        var res = await this.client.get('data/findItems', { query });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'];
        return items;
    }
    async findInstances(query) {
        const res = await this.client.get('data/findInstances', { query });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'];
        return instances;
    }
    async deleteInstances(query) {
        return await this.client.del('data/deleteInstances', { query });
    }
}
export { BPMNClient2, ClientEngine2, ClientData2 };
//# sourceMappingURL=BPMNClient2.js.map