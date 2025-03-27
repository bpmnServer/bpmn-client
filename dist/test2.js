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
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:', process.env.HOST, process.env.PORT, process.env.API_KEY);
        var caseId = Math.floor(Math.random() * 10000);
        let user = { userName: "John", userGroups: ['employee'] };
        let name = 'Buy Used Car';
        let response;
        let instanceId;
        let options = { noWait: true };
        const server1 = new _1.BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);
        response = yield server1.engine.start(name, { caseId: caseId }, user, options);
        console.log(response.id);
        response = yield server1.engine.invoke({ id: response.id, "items.elementId": 'task_Buy' }, null, user, options);
        console.log('invoked', response.id);
    });
}
function importModel() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('from client lib');
        try {
            //    const server = new BPMNClient('localhost', 3000, '12345');
            const dotenv = require('dotenv');
            dotenv.config();
            console.log('env:', process.env.HOST, process.env.PORT, process.env.API_KEY);
            const server = new _1.BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);
            var name = 'test-import';
            var file = '..\\WebApp\\processes\\Trans.bpmn';
            var file2 = '..\\WebApp\\processes\\Trans.svg';
            var res = yield server.model.import(name, file, file2, {});
            return res;
        }
        catch (exc) {
            console.log('*******ERROR********');
            console.log(exc);
        }
    });
}
