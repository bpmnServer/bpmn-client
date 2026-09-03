import { BPMNClient2 } from './BPMNClient2.js';
import { IDefinitionData } from './interfaces/DataObjects.js';
/** Privileged model-administration client for the authorized /api2 surface. */
declare class BPMNAdminClient2 extends BPMNClient2 {
    model: ClientModel2;
    constructor(host: any, port: any, apiKey: any, accessToken?: any);
}
declare class ClientModel2 {
    private client;
    constructor(client: BPMNAdminClient2);
    import(name: any, pathToBPMN: any, pathToSVG?: any): Promise<any>;
    list(): Promise<string[]>;
    delete(name: any): Promise<IDefinitionData>;
    rename(name: any, newName: any): Promise<IDefinitionData>;
    load(name: any): Promise<IDefinitionData>;
    private checkErrors;
}
export { BPMNAdminClient2, ClientModel2 };
