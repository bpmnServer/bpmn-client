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
//FromPostMan();
//request('test4', 'Trans.bpmn');
const _1 = require("./");
console.log('remote-import.ts');
//badImport();
fromClientLib();
console.log('-------------------');
//FromPostMan();
/*
process.on('uncaughtException', function (err) {
console.log('*******************Client ERROR***********');
  console.error(err.stack);
  throw err;
});
*/
function badImport() {
    return __awaiter(this, void 0, void 0, function* () {
        const path = require('path');
        try {
            const bpmnServer = new _1.BPMNClient('127.0.0.1', 3000, 12345);
            const importResult = yield bpmnServer.definitions.import('dummyTest', path.resolve('test.js'));
            console.log('badImport done');
            return 'done';
        }
        catch (err) {
            console.log('badImport Error', err);
        }
    });
}
function fromClientLib() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('from client lib');
        try {
            //    const server = new BPMNClient('localhost', 3000, '12345');
            const dotenv = require('dotenv');
            dotenv.config();
            console.log('env:', process.env.HOST, process.env.PORT, process.env.API_KEY);
            const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
            var name = 'test-import';
            var file = '..\\WebApp\\processes\\Trans.bpmn';
            var file2 = '..\\WebApp\\processes\\Trans.svg';
            var res = yield server.definitions.import(name, file, file2);
            return res;
        }
        catch (exc) {
            console.log('*******ERROR********');
            console.log(exc);
        }
    });
}
function FromPostMan() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing Remote import");
        var file = 'E:\\x4\\dev\\webApp\\processes\\Trans.bpmn';
        var http = require('follow-redirects').http;
        //const http = require('http');
        var fs = require('fs');
        var options = {
            'method': 'POST',
            'hostname': 'localhost',
            'port': 3000,
            'path': '/api/definitions/import/testing4',
            'headers': {
                'x-api-key': '12345',
                'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
            },
            'maxRedirects': 20
        };
        var req = http.request(options, function (res) {
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
        var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\"Trans.bpmn\"\r\nContent-Type: \"text/plain\"\r\n\r\n" + fs.readFileSync(file) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
        req.write(postData);
        req.end();
        return req;
    });
}
function request(name, path) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing Request");
        var http = require('http');
        var fs = require('fs');
        var options = {
            'method': 'POST',
            'hostname': 'localhost',
            'port': 3000,
            'path': '/api/definitions/import/' + name,
            'headers': {
                'x-api-key': '12345',
                'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
            },
            'maxRedirects': 20
        };
        var req = http.request(options, function (res) {
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
        var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
            + path + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" +
            fs.readFileSync(path) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
        req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
        req.write(postData);
        req.end();
        console.log('end');
    });
}
