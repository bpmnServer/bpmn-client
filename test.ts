import { BPMNClient } from './BPMNClient';


async function test() {
    const client = new BPMNClient('bpmn.omniworkflow.com', 80);
    const ret= await client.engine.start({ name: "Buy Used Car", data: {} });
    console.log(ret);

}

