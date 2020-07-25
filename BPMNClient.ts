
const http = require('http');



class BPMNClient {
    host;
    port;
    statusCode;
    result;
    engine: Engine;
    datastore: Datastore;
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.engine = new Engine(this);
        this.datastore = new Datastore(this);
    }

    async get(url, data = {}) {
        return await this.request(url, 'GET', data);

    }
    async post(url, data = {}) {
        return await this.request(url, 'POST', data);

    }
    async put(url, data = {}) {
        return await this.request(url, 'PUT', data);

    }
    async del(url, data = {}) {
        return await this.request(url, 'DELETE', data);

    }
    async request(url, method, params) {

        var options;

        var body = JSON.stringify(params);

        if (params) {
            options = {
                host: this.host,
                port: this.port,
                path: '/api/' + url,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body)
                }
            };
        }
        else {
            options = {
                host: this.host,
                port: this.port,
                path: '/api/' + url,
                method: method
            };
        }
        console.log(options);
        let data = '';
        let self = this;
        return new Promise(function (resolve, reject) {
            try {

                http.request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    //          console.log('HEADERS: ' + JSON.stringify(res.headers));
                    self.statusCode = res.statusCode;
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', () => {
                        //                console.log(JSON.parse(data));
                        self.result = JSON.parse(data);

                        resolve(self.result);
                    });


                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject(err);
                }).end(body);
            }
            catch (exc) {
                console.log(exc);
            }

        });

    }

    getItem(id) {
        if (!this.result.instance) {
            console.log(this.result);
            return;
        }
        return this.result.instance.items.filter(item => { return item.elementId == id; })[0];
    }
}

class Engine {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async start({ name, data }) {
        return await this.client.post('engine/start', { name, data });
    }
    async invoke({ query, data }) {
        return await this.client.put('engine/invoke', { query, data });
    }
    async get(query) {
        return await this.client.get('engine/get', query);
    }
}
class Datastore {
    private client: BPMNClient;

    constructor(client) {
        this.client = client;
    }
    async findItems(query) {
        return await this.client.get('datastore/findItems', query);
    }
    async findInsances(query) {
        return await this.client.get('datastore/findInstances', query);
    }
    async deleteInstances(query) {
        return await this.client.del('datastore/delete', query);
    }
}

export { BPMNClient , Engine}