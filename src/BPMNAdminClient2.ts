import { BPMNClient2 } from './BPMNClient2.js';
import { IDefinitionData } from './interfaces/DataObjects.js';

/** Privileged model-administration client for the authorized /api2 surface. */
class BPMNAdminClient2 extends BPMNClient2 {
    model: ClientModel2;

    constructor(host, port, apiKey) {
        super(host, port, apiKey, '/admin/api2/');
        this.model = new ClientModel2(this);
    }
}

class ClientModel2 {
    private client: BPMNAdminClient2;

    constructor(client: BPMNAdminClient2) {
        this.client = client;
    }

    async import(name, pathToBPMN, pathToSVG = null, user = undefined) {
        const options = {
            method: 'POST',
            host: this.client.host,
            port: this.client.port,
            path: this.client.basePath + 'model/import/' + name,
            headers: { 'x-api-key': this.client.apiKey },
            maxRedirects: 20,
        };

        const result = await this.client.upload(name, pathToBPMN, pathToSVG, options);
        this.checkErrors(result);
        return result;
    }

    async list(user = undefined): Promise<string[]> {
        const result = await this.client.get('model/list', { user });
        this.checkErrors(result);
        return result as string[];
    }

    async delete(name, user = undefined): Promise<IDefinitionData> {
        const result = await this.client.post('model/delete/', { name, user });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    async rename(name, newName, user = undefined): Promise<IDefinitionData> {
        const result = await this.client.post('model/rename/', { name, newName, user });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    async load(name, user = undefined): Promise<IDefinitionData> {
        const result = await this.client.get(encodeURI('model/load/' + name), { name, user });
        this.checkErrors(result);
        return result as IDefinitionData;
    }

    private checkErrors(result) {
        if (result?.errors) throw new Error(result.errors);
    }
}

export { BPMNAdminClient2, ClientModel2 };
