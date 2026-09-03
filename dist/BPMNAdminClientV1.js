import { BPMNAdminClient2 } from './BPMNAdminClient2.js';
/** Canonical privileged client for /admin/api/v1. */
class BPMNAdminClientV1 extends BPMNAdminClient2 {
    constructor(host, port, apiKey, accessToken = null) {
        super(host, port, apiKey, accessToken);
        this.basePath = '/admin/api/v1/';
    }
}
export { BPMNAdminClientV1 };
//# sourceMappingURL=BPMNAdminClientV1.js.map