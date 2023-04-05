import { IInstanceData, IItemData , IDefinitionData} from './interfaces/DataObjects';

console.log("BPMNClient 1.2");

const https = require('https');
const http = require('http');
const fs = require("fs");

class WebService {
    statusCode;
    result;
    response;
    constructor() { }

    async invoke(params, options, postData = null) {

        var axios = require('axios');

        var data = JSON.stringify(params);
        var url = 'http://'+options.host+':'+options.port+options.path;

        if (options.port == 443)
            url = 'https://'+options.host+options.path;

        var config = {
            method: options.method,
            url: url,
            headers: options.headers,
            data: data
        };

        let self = this;

        let response = await axios(config);
        self.result = response.data;

        return response.data;
    }
    async invokeOld(params, options,postData=null) {

        var driver = http;

        var body = JSON.stringify(params);
        console.log('invoke:');
        console.log('options:',options, params);
        if (options.port == 443)
            driver = https;

        let data = '';
        let self = this;
        return new Promise(function (resolve, reject) {
            try {

                var req = driver.request(options, function (res) {
                     console.log('STATUS: ' + res.statusCode);
                    this.response = res;
                    //console.log(res);
                    self.statusCode = res.statusCode;
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('>>chunk', chunk);
                        data += chunk;
                    });
                    res.on('end', () => {
                        console.log('response end');
                        try {
                            if (data == null)
                                console.log("empty response");
                            console.log('data:', data);
                            
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
                else
                    req.write('');
                console.log('request ending',body);
                req.end(body);
                console.log('request ended');
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
;
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

    async upload(url, fileName, path) {
        console.log('upload');
        var options = {
            'method': 'POST',
            'hostname': this.host,
            'port': this.port,
            'path': '/api/'+ url + '/' + fileName,
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

        return req;
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

    
    async import(name, path) {

        var res = await this.client.upload('definitions/import',name,path);

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
}


export { BPMNClient , ClientEngine,ClientDatastore , ClientDefinitions}