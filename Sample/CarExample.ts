import { BPMNClient } from "bpmn-client";

const dotenv = require('dotenv');
const res = dotenv.config();

console.log("Testing BPMNClient 3");

const http = require('http');

    
test();

async function test() {


    const API_KEY = '12345';
    const HOST = 'test.omniworkflow.com';
    const PORT = '443';
    const BASE_URL = 'api';


    console.log('-------- car.js -----------');


    const server = new BPMNClient(HOST, PORT, API_KEY);

    var caseId = Math.floor(Math.random() * 10000);

    let name = 'Buy Used Car';
    let instanceId;

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
