"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();
console.log(res);
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        const caseId = 3040;
        var defs = yield server.definitions.list();
        console.log(defs);
        var def = yield server.definitions.load('Buy Used Car');
        console.log(def['elements']);
        //var instance = await server.engine.start("Buy Used Car", {});
        var instance = yield server.engine.start("Buy Used Car", { caseId: caseId });
        console.log("instance.id", instance.id, instance.name, instance.status, instance.data.caseId);
        var response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_Buy' }, { needsCleaning: "Yes", needsRepairs: "Yes" });
        console.log('after buy', response.id, response.data);
        response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_clean' }, {});
        console.log('after clean', response.id, response.data);
        response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_repair' }, {});
        console.log('after repair', response.id, response.data);
        try {
            response = yield server.engine.invoke({ id: instance.id, "items.elementId": 'task_Drive' }, {});
            console.log('after drive', response.id, response.data);
        }
        catch (exc) {
            console.log(exc);
        }
        var insts = yield server.datastore.findInstances({ data: { caseId: caseId } });
        insts.forEach(inst => {
            console.log('Inst for CaseId id==>' + inst.id, inst.name, inst.data.caseId, 'status==>', inst.status);
        });
        var insts = yield server.datastore.findInstances({ id: instance.id });
        insts.forEach(inst => {
            for (var i = 0; i < inst.items.length; i++) {
                var item = inst.items[i];
                console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
            }
        });
        var inst = yield server.engine.get({ id: instance.id });
        for (var i = 0; i < inst.items.length; i++) {
            var item = inst.items[i];
            console.log('   item: elementId==>' + item.elementId, item.name, 'status==>', item.status);
        }
        //    var items = await server.datastore.findItems({ query: { "items.elementId": "task_Buy" } });
        var items = yield server.datastore.findItems({ id: instance.id });
        items.forEach(item => {
            console.log('item: id==>' + item.elementId, item.type, item.name, 'status==>', item.status);
        });
    });
}
