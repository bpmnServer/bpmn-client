import { BPMNClient } from './';
const fs = require("fs");

const axios = require('axios');
const FormData = require('form-data');


uploadFile('Trans.bpmn');

//-----------------------------------
async function uploadFile(file) {

   var axios = require('axios');

    const fileContents = fs.createReadStream(file);
    const title = 'My file';
  
    const form = new FormData();
    form.append('title', 'title');
    form.append('file', fileContents);
console.log(1);
        var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
            + file + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" +
            fs.readFileSync(file) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
//    formData.append(postData);



  try {
console.log(2,form);

    const response = await axios.post('http://localhost:3000/api/definitions/import/test1', form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": "12345",

      }
    });
console.log(3);

    console.log('Response Status:',response.status,response.data);
  } catch (error) {
    console.log('ERROR------------');
    if (error.response) { // get response with a status code not in range 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) { // no response
      console.log(error.request);
    } else { // Something wrong in setting up the request
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
}


















import * as readline from 'readline';
const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        })
    });
};

//fun1();

async function fun1()
{
    await fun2();
}
async function fun2()
{
    try {
    await fun3();
    }
    catch(exc)
    {
        console.log('error caught but not handled');
    }
}
async function fun3()
{
    throw new Error('fun3');
}
console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();
console.log(res.parsed.PORT);
//raw();


const server = new BPMNClient(process.env.HOST, res.parsed.PORT, process.env.API_KEY);
//testMessage();
// testImport();
/*
test1();
end(); 
*/
async function raw() {
    var https = require('follow-redirects').https;
    var fs = require('fs');

    var options = {
        'method': 'GET',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/datastore/findItems',
        'headers': {
            'x-api-key': '12345',
            'Content-Type': 'application/json',
            'Cookie': 'connect.sid=s%3AFJpzbs-nlVsxrhROzC_e0joMyopi6ke0.uoCjT87OZa3SOJosZxXCrC7zriAIVdMmtwcKsrY2C4I'
        },
        'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = JSON.stringify({ "items.status": "end", "items.elementId": "script_task" });

    req.write(postData);

    req.end();
}

async function end() {
    await question("continue")
}
async function test1() {
    var items = await server.definitions.list();


    items.forEach(item => {
//        console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
    });


}
async function testImport() {


    var file = 'test-import';
    var path = '../webApp/processes/Trans.bpmn';

        var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data;filename=\"" + path + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" + fs.readFileSync(file) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

        console.log(postData);
//        var res = await upload('definitions/import/' + name, postData);

    if(res['errors']) {
        console.log(res['errors']);
        throw new Error(res['errors']);
    }

}
async function testImport2() {


    console.log('calling');
    var file = '../webApp/processes/Trans.bpmn';
    let response = await server.definitions.import('testing_123', file);
    console.log(response);
}

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

    const server = new BPMNClient(process.env.HOST, res.parsed.PORT, process.env.API_KEY);

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


