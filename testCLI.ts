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

async function completeUserTask() {
	console.log('Commands:');
	console.log('	q	to quit');
	console.log('	s	start process ');
	console.log('	lo	list outstanding items');
	console.log('	l	list instances for a process');
	console.log('	di	display Instance information');
	console.log('	i	invoke item');
	console.log('	d	delete instnaces');
	
  let option='';
  var command;
  while(option!=='q')
  {
	command= await question('Enter Command, q to quit\n\r>');
	let opts=command.split(' ');
	option=opts[0];
	switch(option)
	{
		case 'lo':
			console.log("list outstanding items");
			await findItems({ "items.status": "wait"});
			break;
		case 'l':
			console.log("list instances");
			await listInstances();
			break;
		case 'di':
			console.log("displaying ");
			await displayInstance();
			break;
		case 'i':
			console.log("invoking");
			await invoke();
			break;
			
		case 's':
			console.log("starting");
			await start();
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

  if (taskData === ""){
      taskData = {};
  }else{
      taskData = JSON.parse(taskData.toString());
  }
  
  let response=await server.engine.start(name, taskData);

  console.log("Process "+name+" started:", response.items,'InstanceId',response.id);
}
async function findItems(query) {
	var items = await server.datastore.findItems(query);

	console.log(items);
	for (var i = 0; i < items.length; i++) {
		let item = items[i];
		console.log(`${item.name} - ${item.elementId}	instanceId:	${item['instanceId']}`);
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

async function displayInstance() {
	const instanceId = await question('Please provide your Instance ID: ');

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

		console.log("Completed UserTask:", taskId, response.items);

	}
	catch (exc) {
		console.log("Invoking task failed for:", taskId, instanceId);
		await findItems({ id: instanceId, "items.elementId": taskId });


    }
}
async function delInstances() {
	const name = await question('Please provide process name to delete instnaces: ');

	let response = await server.datastore.deleteInstances({ name: name });

	console.log("Instances Deleted:", response['result']['deletedCount']);
}
