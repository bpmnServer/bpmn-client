//import { BPMNClient } from "bpmn-client";
import { BPMNClient } from './';

import * as readline from 'readline';

const dotenv = require('dotenv');
const res = dotenv.config();

const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

const cl = readline.createInterface( process.stdin, process.stdout );
const question = function(q) {
  return new Promise( (res, rej) => {
      cl.question( q, answer => {
          res(answer);
      })
  });
};

completeUserTask();

function menu() {
	console.log('Commands:');
	console.log('	q	to quit');
	console.log('	s	start process ');
	console.log('	lo	list outstanding items');
	console.log('	li	list items');
	console.log('	l	list instances for a process');
	console.log('	di	display Instance information');
	console.log('	i	Invoke Task');
	console.log('	sgl	Signal Task');
	console.log('	msg	Message Task');
	console.log('	d	delete instnaces');
	console.log('	?	repeat this list');

}
async function completeUserTask() {

	menu();
	
  let option='';
  var command;
  while(option!=='q')
  {
	command= await question('Enter Command, q to quit\n\r>');
	let opts=command.split(' ');
	option=opts[0];
	switch(option)
	{
		case '?':
			menu();
			break;
		case 'lo':
			console.log("Listing Outstanding Items");
			await findItems({ "items.status": "wait"});
			break;
		case 'l':
			console.log("Listing Instances for a Process");
			await listInstances();
			break;
		case 'li':
			console.log("list items");
			await listItems();
			break;
		case 'di':
			console.log("Displaying Instance Details");
			await displayInstance();
			break;
		case 'i':
			console.log("invoking");
			await invoke();
			break;
			
		case 's':
			console.log("Starting Process");
			await start();
			break;
		case 'sgl':
			console.log("Signalling Process");
			await signal();
			break;
		case 'msg':
			console.log("Message Process");
			await message();
			break;

		case 'd':
			console.log("deleting");
			await delInstances();
			break;
		
	}
  
  }


  console.log("bye");
 
  cl.close();

}
async function start()
{
  const name = await question('Please provide your process name: ');
  let taskData = await question('Please provide your Task Data (json obj) if any: ');

	console.log(taskData);

	try {
		if (taskData === "") {
			taskData = {};
		} else {
			taskData = JSON.parse(taskData.toString());
		}

	}
	catch (exc) {
		console.log(exc);
		return;
    }
  
  let response=await server.engine.start(name, taskData);

	console.log("Process " + name + " started:", 'InstanceId', response.id);
	return await displayInstance(response.id);
}
async function findItems(query) {
	var items = await server.datastore.findItems(query);

	console.log(`processName	item.name	item.elementId	instanceId	item.id`);
	for (var i = 0; i < items.length; i++) {
		let item = items[i];
		console.log(`${item['processName']}	${item.name}	${item.elementId}	${item['instanceId']}	${item.id}`);
	}

}
async function listItems() {
	const answer = await question('Please items criteria name value pair; example: items.status wait ');
	let str=''+ answer;

	const list = str.split(' ');
	let criteria = {};
	console.log(list);
	for (var i = 0; i < list.length; i += 2) {
		console.log(list[i], list[i + 1]);
		criteria[list[i]] = list[i + 1];
    }
	console.log(criteria);	

	var items = await server.datastore.findItems(criteria)
	console.log(items.length);

	for (var j = 0; j < items.length; j++) {
		let item = items[j];
		console.log(`element: ${item.elementId} status: ${item.status}  processName: ${item['processName']} InstanceId: ${item['instanceId']}	id:	${item.id}`);
	}
}

async function listInstances() {
	const name = await question('Please provide your process name: ');

	let insts = await server.datastore.findInstances({ name: name})

	for (var i = 0; i < insts.length; i++) {
		let inst = insts[i];
		console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
	}
}

async function displayInstance(instanceId=null) {

	if (instanceId==null)
		instanceId = await question('Please provide your Instance ID: ');

	let insts = await server.datastore.findInstances({id: instanceId})

	for (var i = 0; i < insts.length; i++) {
		let inst = insts[i];
		var items = inst.items;
		console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`,'data:', inst.data);
		for (var j = 0; j < items.length; j++) {
			let item= items[j];
			console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
		}
	}
}
async function invoke()
{
  const instanceId = await question('Please provide your Instance ID: ');
  const taskId = await question('Please provide your Task ID: ');
  let taskData = await question('Please provide your Task Data (json obj) if any: ');

  if (taskData === ""){
      taskData = {};
  }else{
      taskData = JSON.parse(taskData.toString());
  }

	try {
		let response = await server.engine.invoke(
			{ id: instanceId, "items.elementId": taskId }
			, taskData);

		console.log("Completed UserTask:", taskId);

		return await displayInstance(response.id);
	}
	catch (exc) {
		console.log("Invoking task failed for:", taskId, instanceId);
		await findItems({ id: instanceId, "items.elementId": taskId });


    }
}

async function signal() {
	const signalId = await question('Please provide signal ID: ');

	let signalData = await question('Please provide your Data (json obj) if any: ');

	//if (typeof signalData === 'string' && signalData.trim() === '') {
	if (signalData === "") {
		signalData = {};
	} else {
		try {
			signalData = JSON.parse(signalData.toString());
		}
		catch (exc) {
			console.log(exc);
			return;
        }
	}

	let response = await server.engine.throwSignal(signalId, signalData);

	console.log("Signal Response:", response);
}

async function message() {
	const messageId = await question('Please provide message ID: ');

	let messageData = await question('Please provide your Data (json obj) if any: ');

	if (typeof messageData === 'string' && messageData.trim() === '') {
		messageData = {};
	} else {
		messageData = JSON.parse(messageData.toString());
	}

	let response = await server.engine.throwMessage(messageId, messageData);

	if (response['id'])
		return await displayInstance(response['id']);
	else {
		console.log(' no results.');
		return null;
    }
}

async function delInstances() {
	const name = await question('Please provide process name to delete instances for process: ');

	let response = await server.datastore.deleteInstances({ name: name });

	console.log("Instances Deleted:", response['result']['deletedCount']);
}
