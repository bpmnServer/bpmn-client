import { BPMNClient } from './BPMNClient.js';
/**
 * Privileged client for deployment-time definition administration on /api.
 * Runtime consumers should use BPMNClient, which intentionally has no
 * definition mutation surface.
 */
class BPMNAdminClient extends BPMNClient {
    definitions;
    constructor(host, port, apiKey) {
        super(host, port, apiKey, '/admin/api/');
        this.definitions = new ClientDefinitions(this);
    }
}
class ClientDefinitions {
    client;
    constructor(client) {
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
    async list() {
        const result = await this.client.get('definitions/list', []);
        this.checkErrors(result);
        return result;
    }
    async delete(name) {
        const result = await this.client.post('definitions/delete/', { name });
        this.checkErrors(result);
        return result;
    }
    async rename(name, newName) {
        const result = await this.client.post('definitions/rename/', { name, newName });
        this.checkErrors(result);
        return result;
    }
    async load(name) {
        const result = await this.client.get(encodeURI('definitions/load/' + name), { name });
        this.checkErrors(result);
        return result;
    }
    checkErrors(result) {
        if (result?.errors)
            throw new Error(result.errors);
    }
}
export { BPMNAdminClient, ClientDefinitions };
//# sourceMappingURL=BPMNAdminClient.js.map