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

test('admin clients expose definition administration explicitly', () => {
    assert.ok(new BPMNAdminClient('localhost', 3000, 'key').definitions);
    assert.ok(new BPMNAdminClient2('localhost', 3000, 'key').model);
});
