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
monitor();
function monitor() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        console.log('running monitor');
        for (var i = 0; i < 1000; i++) {
            yield checkStatus(server);
            yield delay(15000, 'test');
        }
    });
}
function checkStatus(server, reason = '') {
    return __awaiter(this, void 0, void 0, function* () {
        var list = yield server.engine.status();
        var insT = 0, insR = 0, itmT = 0, itmR = 0, tokT = 0, tokR = 0;
        for (var i = 0; i < list.length; i++) {
            var exec = list[i];
            var dInstance = null;
            insT++;
            tokT += exec.instance.tokens.length;
            if (exec.instance.status == 'running')
                insR++;
            var started = dateDiff(exec.instance.startedAt);
            var ended = dateDiff(exec.instance.endedAt);
            var msg = ` Instance for '${exec.instance.name}'  Status: ${exec.status} Started At ${started} Ended ${ended} items: ${exec.instance.items.length}`;
            try {
                dInstance = yield server.datastore.findInstances({ id: exec.instance.id }, {});
                //console.log(reason+' logs:',exec.instance.logs.length, dInstance.logs.length,dInstance.data.caseId);
                if (dInstance.length > 0)
                    msg += ' items:' + dInstance[0].items.length;
            }
            catch (exc) {
                msg += ' no instance' + exc.toString();
            }
            console.log(msg);
        }
        console.log(`${reason} ->Instances: Total: ${insT} Running: ${insR}`); // Tokens: ${tokT} `);
    });
}
function delay(time, result) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(result);
            }, time);
        });
    });
}
function dateDiff(dateStr) {
    var endDate = new Date();
    var startTime = new Date(dateStr);
    var time1 = endDate.getTime();
    var time2 = startTime;
    var seconds = Math.abs(time1 - time2) / 1000;
    // get total seconds between the times
    var delta = seconds; //Math.abs(date_future - date_now) / 1000;
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = Math.floor(delta % 60); // in theory the modulus is not required
    if (days > 0)
        return (days + " days");
    if (hours > 0)
        return (hours + " hours");
    if (minutes > 0)
        return (minutes + " minutes");
    return (seconds + " seconds");
}
