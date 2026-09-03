cbpmn-client
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

This is a light-weight package to allow remote access to [bpmn-server](https://github.com/bpmnServer/bpmn-server)

New runtime code should use `BPMNClientV1`; deployment tools should use
`BPMNAdminClientV1`. These clients target the canonical `/api/v1` and
`/admin/api/v1` contracts. `BPMNClient` and `BPMNClient2` remain compatibility
clients for the deprecated `/api` and `/api2` routes.

The runtime clients expose
workflow execution and runtime data operations, but intentionally do not expose
definition/model mutation. Deployment and administration tools must opt into
`BPMNAdminClient` or `BPMNAdminClient2` explicitly.

```ts
import { BPMNClientV1, BPMNAdminClientV1 } from 'bpmn-client';

const runtime = new BPMNClientV1(host, port, apiKey);
const admin = new BPMNAdminClientV1(host, port, adminApiKey);

await runtime.engine.start('order-approval', input, user);
await admin.model.import('order-approval', './order-approval.bpmn');
```

# Installation

This installs bpmn-client-sample application along with `bpmn-client`

```sh

git clone https://github.com/bpmnServer/bpmn-client-sample.git

cd bpmn-client-sample

npm install

npm run setup

npm run cli

```
the above setup command will copy .env 
You can edit .env file to point to your implementation of `bpmn-server`

### to update to latest release

```
$ npm update bpmn-client
```
