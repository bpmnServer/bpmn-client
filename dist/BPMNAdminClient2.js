import { BPMNClient2 } from './BPMNClient2.js';
/** Privileged model-administration client for the authorized /api2 surface. */
class BPMNAdminClient2 extends BPMNClient2 {
    model;
    constructor(host, port, apiKey) {
        super(host, port, apiKey, '/admin/api2/');
        this.model = new ClientModel2(this);
    }
}
class ClientModel2 {
    client;
    constructor(client) {
        this.client = client;
    }
    async import(name, pathToBPMN, pathToSVG = null, user = undefined) {
        const options = {
            method: 'POST',
            host: this.client.host,
            port: this.client.port,
            path: '/admin/api2/model/import/' + name,
            headers: { 'x-api-key': this.client.apiKey },
            maxRedirects: 20,
        };
        const result = await this.client.upload(name, pathToBPMN, pathToSVG, options);
        this.checkErrors(result);
        return result;
    }
    async list(user = undefined) {
        const result = await this.client.get('model/list', { user });
        this.checkErrors(result);
        return result;
    }
    async delete(name, user = undefined) {
        const result = await this.client.post('model/delete/', { name, user });
        this.checkErrors(result);
        return result;
    }
    async rename(name, newName, user = undefined) {
        const result = await this.client.post('model/rename/', { name, newName, user });
        this.checkErrors(result);
        return result;
    }
    async load(name, user = undefined) {
        const result = await this.client.get(encodeURI('model/load/' + name), { name, user });
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