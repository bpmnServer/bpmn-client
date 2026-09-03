import { BPMNClient2 } from './BPMNClient2.js';

/** Canonical client for the versioned, authorized /api/v1 contract. */
class BPMNClientV1 extends BPMNClient2 {
    constructor(host, port, apiKey, accessToken = null) {
        super(host, port, apiKey, '/api/v1/', accessToken);
    }
}

export { BPMNClientV1 };
