cbpmn-client
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

This is a light-weight package to allow remote access to [bpmn-server](https://github.com/bpmnServer/bpmn-server)

Runtime code should use `BPMNClient` or `BPMNClient2`. These clients expose
workflow execution and runtime data operations, but intentionally do not expose
definition/model mutation. Deployment and administration tools must opt into
`BPMNAdminClient` or `BPMNAdminClient2` explicitly.

```ts
import { BPMNClient2, BPMNAdminClient2 } from 'bpmn-client';

const runtime = new BPMNClient2(host, port, apiKey);
const admin = new BPMNAdminClient2(host, port, adminApiKey);

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
