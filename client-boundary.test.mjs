import test from 'node:test';
import assert from 'node:assert/strict';

import {
    BPMNClient,
    BPMNClient2,
    BPMNAdminClient,
    BPMNAdminClient2,
    BPMNClientV1,
    BPMNAdminClientV1,
} from './dist/index.js';

test('runtime clients do not expose definition administration', () => {
    assert.equal(new BPMNClient('localhost', 3000, 'key').definitions, undefined);
    assert.equal(new BPMNClient2('localhost', 3000, 'key').model, undefined);
});

test('v1 clients use the canonical versioned routes', () => {
    assert.equal(new BPMNClientV1('localhost', 3000, 'key').basePath, '/api/v1/');
    assert.equal(new BPMNAdminClientV1('localhost', 3000, 'key').basePath, '/admin/api/v1/');
});

test('v1 client never serializes caller-supplied identity', async () => {
    const client = new BPMNClientV1('localhost', 3000, 'key');
    let body;
    client.post = async (_path, value) => { body = value; return {}; };

    await client.engine.start('process', { caseId: 1 });
    assert.equal(Object.hasOwn(body, 'user'), false);
});

test('v1 client can carry a token for an injected principal resolver', async () => {
    const client = new BPMNClientV1('localhost', 3000, 'key', 'signed-token');
    client.invoke = async (_params, options) => options.headers;
    const headers = await client.get('status', {});
    assert.equal(headers.Authorization, 'Bearer signed-token');
});

test('admin clients expose definition administration explicitly', () => {
    assert.ok(new BPMNAdminClient('localhost', 3000, 'key').definitions);
    assert.ok(new BPMNAdminClient2('localhost', 3000, 'key').model);
});

test('v1 client exposes migrated legacy operations on the authorized contract', async () => {
    const client = new BPMNClientV1('localhost', 3000, 'key');
    const calls = [];
    client.put = async (path, body) => { calls.push(['put', path, body]); return { instance: { id: 1 } }; };
    client.get = async (path, body) => { calls.push(['get', path, body]); return { instance: { id: 2 } }; };

    await client.engine.restart({ id: 1 }, { approved: true });
    await client.engine.get({ id: 2 });

    assert.deepEqual(calls, [
        ['put', 'engine/restart', { query: { id: 1 }, data: { approved: true }, options: {} }],
        ['get', 'engine/get', { query: { id: 2 } }]
    ]);
});
