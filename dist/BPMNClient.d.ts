import { IInstanceData, IItemData, IDefinitionData } from './interfaces/DataObjects.js';
import { WebService } from './WebService.js';
declare class BPMNClient extends WebService {
    host: any;
    port: any;
    apiKey: any;
    engine: ClientEngine;
    datastore: ClientDatastore;
    definitions: ClientDefinitions;
    constructor(host: any, port: any, apiKey: any);
    get(url: any, data?: {}): Promise<any>;
    post(url: any, data?: {}): Promise<any>;
    put(url: any, data?: {}): Promise<any>;
    del(url: any, data?: {}): Promise<any>;
    request(url: any, method: any, params: any): Promise<any>;
}
declare class ClientEngine {
    private client;
    constructor(client: any);
    start(name: any, data?: {}, startNodeId?: any, userId?: any, options?: {}): Promise<IInstanceData>;
    invoke(query: any, data: any, userId?: any, options?: {}): Promise<IInstanceData>;
    assign(query: any, data: any, userId: any, assignment: any): Promise<IInstanceData>;
    restart(query: any, data: any, userId?: any, options?: {}): Promise<IInstanceData>;
    throwMessage(messageId: any, data?: {}, messageMatchingKey?: {}): Promise<any>;
    throwSignal(signalId: any, data?: {}, messageMatchingKey?: {}): Promise<any>;
    startEvent(instanceId: any, startNodeId: any, data?: {}, userId?: any, options?: {}): Promise<IInstanceData>;
    get(query: any): Promise<IInstanceData>;
    status(): Promise<any>;
}
declare class ClientDatastore {
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
    findInstances(query: any, projection?: {}): Promise<IInstanceData[]>;
    deleteInstances(query: any): Promise<any>;
}
declare class ClientDefinitions {
    private client;
    constructor(client: any);
    import(name: any, pathToBPMN: any, pathToSVG?: any): Promise<any>;
    list(): Promise<string[]>;
    delete(name: any): Promise<IDefinitionData>;
    rename(name: any, newName: any): Promise<IDefinitionData>;
    load(name: any): Promise<IDefinitionData>;
    checkErrors(res: any): void;
}
export { BPMNClient, ClientEngine, ClientDatastore, ClientDefinitions };
