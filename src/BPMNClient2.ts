import { IInstanceData, IItemData } from './interfaces/DataObjects.js';
import {WebService} from './WebService.js';


class BPMNClient2 extends WebService {
    host;
    port;
    apiKey;
    basePath;
    accessToken;
    engine: ClientEngine2;
    data: ClientData2;

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

    async get(url,params) {
        return await this.request(url, 'GET', params);

    }
    async post(url,params) {
        return await this.request(url, 'POST', params);

    }
    async put(url,params) {
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
            "Content-Type": contentType ,
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
    private client: BPMNClient2;

    constructor(client) {
        this.client = client;
    }
    async start(name, data = {}, options = {}): Promise<IInstanceData> {
        const ret = await this.client.post('engine/start',
            { name, data, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret as IInstanceData;
        return instance;
    }
    async invoke(query, data, options={}): Promise<IInstanceData> {
        const ret = await this.client.put('engine/invoke',
             { query, data, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }
    async assign(query, data, assignment): Promise<IInstanceData> {
        const ret = await this.client.put('engine/assign',
             { query, data, assignment });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        const instance = ret['instance'] as IInstanceData;
        return instance;
    }

    async restart(query, data = {}, options = {}): Promise<IInstanceData> {
        const ret = await this.client.put('engine/restart', { query, data, options });
        if (ret['errors'])
            throw new Error(ret['errors']);
        return ret['instance'] as IInstanceData;
    }

    async get(query): Promise<IInstanceData> {
        const ret = await this.client.get('engine/get', { query });
        if (ret['errors'])
            throw new Error(ret['errors']);
        return ret['instance'] as IInstanceData;
    }

    async throwMessage(messageId, data = {}, messageMatchingKey = {}, options = {}) {
        const ret = await this.client.post('engine/throwMessage',
             { messageId, data, messageMatchingKey, options });
        if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }
    async throwSignal(signalId, data = {}, messageMatchingKey = {}, options = {}) {
        const ret = await this.client.post('engine/throwSignal', 
            { signalId, data, messageMatchingKey, options });

            if (ret['errors']) {
            console.log(ret['errors']);
            throw new Error(ret['errors']);
        }
        return ret;
    }

}
class ClientData2 {
    private client: BPMNClient2;

    constructor(client) {
        this.client = client;
    }
    async find({
        filter,
        sort,
        limit,
        after,
        projection,
        lastItem,
		latestItem,
        getTotalCount}:
        {
            filter?: Record<string, any>;
            after?: string;
            limit?: number;
            sort?: Record<string, 1 | -1>;
            projection?: Record<string, 0 | 1| any>;
            lastItem?: Record<string, any>;
            latestItem?: Record<string,any>;
            getTotalCount?: boolean; // if true, return total count of items in the result set
          }            
        )
    : Promise<   { data?: any[];
                nextCursor?: string | null;
                totalCount?: number;
                error?: string; }> {
    var res = await this.client.get('datastore/find',
        {filter,after,limit,sort,projection,lastItem,latestItem,getTotalCount}
    );
    if (res.error) {
        console.log(res.error);
        throw new Error(res.error);
        
        throw new Error(res['errors']);
    }
    return res;

    }

    async findItems(query): Promise<IItemData[]> {
        var res = await this.client.get('data/findItems', 
            { query });

        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const items = res['items'] as IItemData[];
        return items;

    }
    async findInstances(query): Promise<IInstanceData[]> {
        const res = await this.client.get('data/findInstances', 
            { query });

        if (res['errors']) {
            console.log(res['errors']);
            throw new Error(res['errors']);
        }
        const instances = res['instances'] as IInstanceData[];
        return instances;
    }
    async deleteInstances(query) {
        return await this.client.del('data/deleteInstances', 
            { query });
    }
}
export { BPMNClient2, ClientEngine2, ClientData2 }
