import { IInstanceData, IItemData , IDefinitionData} from './interfaces/DataObjects';
import {WebService} from './WebService';


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
        var size = Buffer.byteLength(body);
        var contentType = "application/json";

        if (method == 'UPLOAD') {
            contentType = 'multipart/form-data; boundary = ----WebKitFormBoundary7MA4YWxkTrZu0gW';
            method = 'POST';
        }

        var headers = {
            "Content-Type": contentType ,
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

        return await this.invoke(params, options);

    }

}

class ClientEngine {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, startNodeId = null,  userId= null,options = {}): Promise<IInstanceData> {
        const ret = await this.client.post('engine/start',
            { name, data, startNodeId, userId, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret as IInstanceData;
        return instance;
    }
    async invoke(query, data, userId= null,options={}): Promise<IInstanceData> {
        console.log('invoke',options);
        const ret = await this.client.put('engine/invoke', { query, data , userId ,options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }
    async assign(query, data, userId= null,assignment): Promise<IInstanceData> {
        const ret = await this.client.put('engine/assign', { query, data , userId,assignment });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }
    async restart(query, data, userId= null,options={}): Promise<IInstanceData> {
        console.log('invoke',options);
        const ret = await this.client.put('engine/restart', { query, data , userId ,options });
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
    
    async import(name, pathToBPMN,pathToSVG=null) {

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

        console.log('import ',name,pathToBPMN,pathToSVG);
        var res = await this.client.upload(name,pathToBPMN,pathToSVG,options);
        console.log('import done ',res);
        this.checkErrors(res);
        return res;

    }
    async list(): Promise<string[]> {
        var res = await this.client.get('definitions/list', []);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        return res as string[];

    }
    async delete(name) {
        const res = await this.client.post('definitions/delete/', { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        console.log(res);
        return res as IDefinitionData;

    }
    async rename(name,newName) {
        const res = await this.client.post('definitions/rename/', { name , newName });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        console.log(res);
        return res as IDefinitionData;

    }
    async load(name): Promise<IDefinitionData> {
        const res = await this.client.get(encodeURI('definitions/load/' + name), { name });
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        console.log(res);
        return res as IDefinitionData;
    }
    checkErrors(res) {
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
    }
}


export { BPMNClient , ClientEngine,ClientDatastore , ClientDefinitions}