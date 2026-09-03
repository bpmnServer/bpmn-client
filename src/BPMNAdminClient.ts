import { BPMNClient } from './BPMNClient.js';
import { IDefinitionData } from './interfaces/DataObjects.js';

/**
 * Privileged client for deployment-time definition administration on /api.
 * Runtime consumers should use BPMNClient, which intentionally has no
 * definition mutation surface.
 */
class BPMNAdminClient extends BPMNClient {
    definitions: ClientDefinitions;

    constructor(host, port, apiKey) {
        super(host, port, apiKey, '/admin/api/');
        this.definitions = new ClientDefinitions(this);
    }
}

class ClientDefinitions {
    private client: BPMNAdminClient;

    constructor(client: BPMNAdminClient) {
        this.client = client;
    }

    async import(name, pathToBPMN, pathToSVG = null) {
        const options = {
            method: 'POST',
            host: this.client.host,
            port: this.client.port,
            path: '/admin/api/definitions/import/' + name,
            headers: { 'x-api-key': this.client.apiKey },
            maxRedirects: 20,
        };

        const result = await this.client.upload(name, pathToBPMN, pathToSVG, options);
        this.checkErrors(result);
        return result;
    }

    async list(): Promise<string[]> {
        const result = await this.client.get('definitions/list', []);
        this.checkErrors(result);
        return result as string[];
    }

    async delete(name): Promise<IDefinitionData> {
        const result = await this.client.post('definitions/delete/', { name });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    async rename(name, newName): Promise<IDefinitionData> {
        const result = await this.client.post('definitions/rename/', { name, newName });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    async load(name): Promise<IDefinitionData> {
        const result = await this.client.get(encodeURI('definitions/load/' + name), { name });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    private checkErrors(result) {
        if (result?.errors) throw new Error(result.errors);
    }
}

export { BPMNAdminClient, ClientDefinitions };
