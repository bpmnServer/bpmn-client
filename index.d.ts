declare class BPMNClient {
    host: any;
    port: any;
    statusCode: any;
    result: any;
    engine: Engine;
    datastore: Datastore;
    constructor(host: any, port: any);
    get(url: any, data?: {}): Promise<unknown>;
    post(url: any, data?: {}): Promise<unknown>;
    put(url: any, data?: {}): Promise<unknown>;
    del(url: any, data?: {}): Promise<unknown>;
    request(url: any, method: any, params: any): Promise<unknown>;
    getItem(id: any): any;
}
declare class Engine {
    private client;
    constructor(client: any);
    start({ name, data }: {
        name: any;
        data: any;
    }): Promise<unknown>;
    invoke({ query, data }: {
        query: any;
        data: any;
    }): Promise<unknown>;
    get(query: any): Promise<unknown>;
}
declare class Datastore {
    private client;
    constructor(client: any);
    findItems(query: any): Promise<unknown>;
    findInsances(query: any): Promise<unknown>;
    deleteInstances(query: any): Promise<unknown>;
}
export { BPMNClient, Engine };
