import { BPMNClient } from "bpmn-client";

console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();


console.log("Testing BPMNClient");
test();

async function test() {
    //const client = new BPMNClient('localhost', 3000,12345);
    const client= new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
    var instance = await client.engine.start("Buy Used Car",  {} );
    console.log("instance.id", instance.id, instance.name,instance.status);

    var insts= await client.datastore.findInstances({ 'status': 'running' });

    insts.forEach(inst => {
        console.log('id==>' + inst.id,inst.name, 'status==>',inst.status);
    });


    var items = await client.datastore.findItems({ query: { "items.elementId": "task_Buy" } });

    
    items.forEach(item => {
        console.log('item: id==>' + item.id, item.name, 'status==>', item.status);
    });

}

