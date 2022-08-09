//import { BPMNClient } from './';
//import { BPMNServer, IInstanceData, IItemData } from './';

import { BPMNServer, IDefinition, IInstanceData, IItemData } from '../WebApp/';

const dotenv = require('dotenv');
const res = dotenv.config();

console.log("Testing BPMNClient 2");

const https = require('https');
const http = require('http');

class WebService {
    statusCode;
    result;
    constructor() {}
    async invoke(params, options) {

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
    async start(name, data): Promise<IInstanceData>{
        const ret = await this.client.post('engine/start', { name, data });
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
    
    async get(query): Promise<IInstanceData> {
        const ret=await this.client.get('engine/get', query);
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    } 
}
class ClientDatastore {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async findItems(query) : Promise<IItemData []>{
        var res = await this.client.get('datastore/findItems', query);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'] as IItemData[];
        return items;

    }
    async findInstances(query) : Promise<IInstanceData []> {
        const res = await this.client.get('datastore/findInstances', query);
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'] as IInstanceData[];
        return instances;
    }
    async deleteInstances(query) {
        return await this.client.del('datastore/delete', query);
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
    async load(name): Promise<IDefinition> {
        const res = await this.client.get(encodeURI('definitions/load/'+name), {name:name} );
        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        console.log(res);
        return res as IDefinition;
    }
}



test();

async function test() {

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

    var defs = await server.definitions.list();

    console.log(defs);
    var def = await server.definitions.load('Buy Used Car');
    
    console.log(def['elements']);

    //var instance = await client.engine.start("Buy Used Car", {});

    var instance = await server.engine.start("Buy Used Car", { caseId: caseId });


    console.log("instance.id", instance.id, instance.name, instance.status, instance.data.caseId);

    var response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_Buy' }
        , { needsCleaning: "Yes", needsRepairs: "Yes" });

    console.log('after buy', response.id, response.data);

    response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_clean' }
        , {});

    console.log('after clean', response.id, response.data);
    
    response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_repair' }
        , {});

    console.log('after repair', response.id, response.data);


    try {
        response = await server.engine.invoke(
            { id: instance.id, "items.elementId": 'task_Drive' }
            , {});

        console.log('after drive', response.id, response.data);

    }
    catch (exc) {
        console.log(exc);
    }



    var insts = await client.datastore.findInstances({ data: { caseId: caseId } });

    insts.forEach(inst => {
        console.log('Inst for CaseId id==>' + inst.id, inst.name, inst.data.caseId, 'status==>', inst.status);
    });
    var insts = await client.datastore.findInstances({ id: instance.id });

    insts.forEach(inst => {
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);

        }
    });

    var inst = await client.engine.get( { id: instance.id });

    
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);

        }



//    var items = await client.datastore.findItems({ query: { "items.elementId": "task_Buy" } });
    var items = await client.datastore.findItems({  id: instance.id} );

    
    items.forEach(item => {
        console.log('item: id==>' + item.elementId,item.type, item.name, 'status==>', item.status);
    });

}

