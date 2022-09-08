import { BPMNClient } from './';


console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();

const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

testMessage();

async function displayInstance(instanceId) {

    let insts = await server.datastore.findInstances({ id: instanceId })

    for (var i = 0; i < insts.length; i++) {
        let inst = insts[i];
        var items = inst.items;
        console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
        for (var j = 0; j < items.length; j++) {
            let item = items[j];
            console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
        }
    }
}


async function testMessage() {
    const messageId = 'Message-104';

    let messageData = {};

    console.log('calling');
    let response = await server.engine.throwMessage(messageId, messageData);
    if (response['id'])
        return await displayInstance(response['id']);
    else
        return null;
}


async function test() {

    const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

    const caseId = 3040;


    var delResp = await server.datastore.deleteInstances({ name: 'Buy Used Car' });
    //console.log(delResp);
    //return;
    var defs = await server.definitions.list();

    console.log(defs);
    var def = await server.definitions.load('Buy Used Car');

    console.log(def['elements']);

    //var instance = await server.engine.start("Buy Used Car", {});

    var instance = await server.engine.start("Buy Used Car", { caseId: caseId });


    console.log("instance.id", instance.id, instance.name, instance.status, instance.data.caseId);

    var response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_Buy' }
        , { needsCleaning: "Yes", needsRepairs: "Yes" });

    console.log('after buy', response.id, response.data);

    response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_clean' }
        , {});

    console.log('after clean', response.id, response.data);

    response = await server.engine.invoke(
        { id: instance.id, "items.elementId": 'task_repair' }
        , {});

    console.log('after repair', response.id, response.data);


    try {
        response = await server.engine.invoke(
            { id: instance.id, "items.elementId": 'task_Drive' }
            , {});

        console.log('after drive', response.id, response.data);

    }
    catch (exc) {
        console.log(exc);
    }




    var items = await server.datastore.findItems({ "items.status": "end", "items.elementId": "task_Buy" });


    items.forEach(item => {
        console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
    });



    var insts = await server.datastore.findInstances({ data: { caseId: caseId } });

    insts.forEach(inst => {
        console.log('Inst for CaseId id==>' + inst.id, inst.name, inst.data.caseId, 'status==>', inst.status);
    });
    var insts = await server.datastore.findInstances({ id: instance.id });

    insts.forEach(inst => {
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);

        }
    });

    var inst = await server.engine.get({ id: instance.id });


    for (var i = 0; i < inst.items.length; i++) {
        var item = inst.items[i];
        console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);

    }



    //    var items = await server.datastore.findItems({ query: { "items.elementId": "task_Buy" } });
    var items = await server.datastore.findItems({ id: instance.id });


    items.forEach(item => {
        console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
    });
}

async function delay(time, result) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(result);
        }, time);
    });
}


