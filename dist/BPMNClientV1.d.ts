import { BPMNClient2 } from './BPMNClient2.js';
/** Canonical client for the versioned, authorized /api/v1 contract. */
declare class BPMNClientV1 extends BPMNClient2 {
    constructor(host: any, port: any, apiKey: any, accessToken?: any);
}
export { BPMNClientV1 };
