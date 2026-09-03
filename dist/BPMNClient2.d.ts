import { IInstanceData, IItemData } from './interfaces/DataObjects.js';
import { WebService } from './WebService.js';
declare class BPMNClient2 extends WebService {
    host: any;
    port: any;
    apiKey: any;
    basePath: any;
    accessToken: any;
    engine: ClientEngine2;
    data: ClientData2;
    constructor(host: any, port: any, apiKey: any, basePath?: string, accessToken?: any);
    get(url: any, params: any): Promise<any>;
    post(url: any, params: any): Promise<any>;
    put(url: any, params: any): Promise<any>;
    del(url: any, params: any): Promise<any>;
    request(url: any, method: any, params: any): Promise<any>;
}
declare class ClientEngine2 {
    private client;
    constructor(client: any);
    start(name: any, data?: {}, options?: {}): Promise<IInstanceData>;
    invoke(query: any, data: any, options?: {}): Promise<IInstanceData>;
    assign(query: any, data: any, assignment: any): Promise<IInstanceData>;
    restart(query: any, data?: {}, options?: {}): Promise<IInstanceData>;
    get(query: any): Promise<IInstanceData>;
    throwMessage(messageId: any, data?: {}, messageMatchingKey?: {}, options?: {}): Promise<any>;
    throwSignal(signalId: any, data?: {}, messageMatchingKey?: {}, options?: {}): Promise<any>;
}
declare class ClientData2 {
    private client;
    constructor(client: any);
    find({ filter, sort, limit, after, projection, lastItem, latestItem, getTotalCount }: {
        filter?: Record<string, any>;
        after?: string;
        limit?: number;
        sort?: Record<string, 1 | -1>;
        projection?: Record<string, 0 | 1 | any>;
        lastItem?: Record<string, any>;
        latestItem?: Record<string, any>;
        getTotalCount?: boolean;
    }): Promise<{
        data?: any[];
        nextCursor?: string | null;
        totalCount?: number;
        error?: string;
    }>;
    findItems(query: any): Promise<IItemData[]>;
    findInstances(query: any): Promise<IInstanceData[]>;
    deleteInstances(query: any): Promise<any>;
}
export { BPMNClient2, ClientEngine2, ClientData2 };
