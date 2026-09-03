import { BPMNClient } from './BPMNClient.js';
import { IDefinitionData } from './interfaces/DataObjects.js';
/**
 * Privileged client for deployment-time definition administration on /api.
 * Runtime consumers should use BPMNClient, which intentionally has no
 * definition mutation surface.
 */
declare class BPMNAdminClient extends BPMNClient {
    definitions: ClientDefinitions;
    constructor(host: any, port: any, apiKey: any);
}
declare class ClientDefinitions {
    private client;
    constructor(client: BPMNAdminClient);
    import(name: any, pathToBPMN: any, pathToSVG?: any): Promise<any>;
    list(): Promise<string[]>;
    delete(name: any): Promise<IDefinitionData>;
    rename(name: any, newName: any): Promise<IDefinitionData>;
    load(name: any): Promise<IDefinitionData>;
    private checkErrors;
}
export { BPMNAdminClient, ClientDefinitions };
