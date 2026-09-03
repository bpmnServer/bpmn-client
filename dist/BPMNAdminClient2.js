import { BPMNClient2 } from './BPMNClient2.js';
/** Privileged model-administration client for the authorized /api2 surface. */
class BPMNAdminClient2 extends BPMNClient2 {
    model;
    constructor(host, port, apiKey, accessToken = null) {
        super(host, port, apiKey, '/admin/api2/', accessToken);
        this.model = new ClientModel2(this);
    }
}
class ClientModel2 {
    client;
    constructor(client) {
        this.client = client;
    }
    async import(name, pathToBPMN, pathToSVG = null) {
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
    async list() {
        const result = await this.client.get('model/list', {});
        this.checkErrors(result);
        return result;
    }
    async delete(name) {
        const result = await this.client.post('model/delete/', { name });
        this.checkErrors(result);
        return result;
    }
    async rename(name, newName) {
        const result = await this.client.post('model/rename/', { name, newName });
        this.checkErrors(result);
        return result;
    }
    async load(name) {
        const result = await this.client.get(encodeURI('model/load/' + name), { name });
        this.checkErrors(result);
        return result;
    }
    checkErrors(result) {
        if (result?.errors)
            throw new Error(result.errors);
    }
}
export { BPMNAdminClient2, ClientModel2 };
//# sourceMappingURL=BPMNAdminClient2.js.map