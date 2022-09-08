import { IInstanceData, IItemData , IDefinitionData} from './interfaces/DataObjects';

console.log("BPMNClient 1.2");

const https = require('https');
const http = require('http');

class WebService {
    statusCode;
    result;
    response;
    constructor() { }
    async invoke(params, options) {

        var driver = http;
        var body = JSON.stringify(params);

//        console.log(options, params);
        if (options.port == 443)
            driver = https;

        let data = '';
        let self = this;
        return new Promise(function (resolve, reject) {
            try {

                driver.request(options, function (res) {
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


                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject(err);
                }).end(body);
            }
            catch (exc) {
                console.log(exc);
            }

        });

    }
}
class BPMNClient extends WebService {
    host;
    port;
    apiKey;
    engine: ClientEngine;
    datastore: ClientDatastore;
    definitions: ClientDefinitions;

    constructor(host, port, apiKey) {
        super();
        this.host = host;
        this.port = port;
        this.apiKey = apiKey;
        this.engine = new ClientEngine(this);
        this.datastore = new ClientDatastore(this);
        this.definitions = new ClientDefinitions(this);
    }

    async get(url, data = {}) {
        return await this.request(url, 'GET', data);

    }
    async post(url, data = {}) {
        return await this.request(url, 'POST', data);

    }
    async put(url, data = {}) {
        return await this.request(url, 'PUT', data);

    }
    async del(url, data = {}) {
        return await this.request(url, 'DELETE', data);

    }
    async request(url, method, params) {

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


        return await this.invoke(params, options);

    }

}

class ClientEngine {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, startNodeId = null, options = {}): Promise<IInstanceData> {
        const ret = await this.client.post('engine/start',
            { name, data, startNodeId, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret as IInstanceData;
        return instance;
    }
    async invoke(query, data): Promise<IInstanceData> {
        const ret = await this.client.put('engine/invoke', { query, data });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }

    async throwMessage(messageId, data = {} , messageMatchingKey = {}) {
        const ret = await this.client.post('engine/throwMessage', { "messageId": messageId, "data": data, messageMatchingKey });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async throwSignal(signalId, data = {} , messageMatchingKey = {}) {
        const ret = await this.client.post('engine/throwSignal', { "signalId": signalId, "data": data, messageMatchingKey });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }

    async get(query): Promise<IInstanceData> {
        const ret = await this.client.get('engine/get', query);
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }
    async status() {
        const ret = await this.client.get('engine/status', {});
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
}
class ClientDatastore {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async findItems(query): Promise<IItemData[]> {
        var res = await this.client.get('datastore/findItems', query);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'] as IItemData[];
        return items;

    }
    async findInstances(query): Promise<IInstanceData[]> {
        const res = await this.client.get('datastore/findInstances', query);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'] as IInstanceData[];
        return instances;
    }
    async deleteInstances(query) {
        return await this.client.del('datastore/deleteInstances', query);
    }
}
class ClientDefinitions {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async list(): Promise<string[]> {
        var res = await this.client.get('definitions/list', []);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res as string[];

    }
    async load(name): Promise<IDefinitionData> {
        const res = await this.client.get(encodeURI('definitions/load/' + name), { name: name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        console.log(res);
        return res as IDefinitionData;
    }
}


export { BPMNClient , ClientEngine,ClientDatastore , ClientDefinitions}