/**
 * Modbus-event is a TCP/IP Master, event-driven, implementation for modbus protocol.
 * Created by Raphael Brandão (a.k.a. ralpha) on 20/05/2016.
 * Contact me: raphael.b.souza@hotmail.com
 * More information on NPM: https://www.npmjs.com/package/modbus-event
 */
// Modulo modbus-serial
var ModbusRTU = require('modbus-serial');
var client = new ModbusRTU();
// vars
var arrays = {
  coils : [], inputStatus : [], holdingReg : [], inputReg : []
}, events = {
    update : 'callback(type, address, from, to)'
}, defs = {}, firstUpdate = true, stack = [];


var print = function(type, msg){
    if(!defs.debug) return;
    if(type === 0 || !msg) return console.log('[Modbus-event] ' + (msg || type));
    return console.error('[Modbus-event] ' + msg);
};

var displayChange = function(data, array, key){
    for(var i = 0; i<data.length; i++){
        if(data[i] !== array[i]){
            print('[' + key + ':' + i + '] ' + array[i] + ' -> ' + data[i]);
            events.update && typeof events.update === 'function' && events.update(key, i, array[i], data[i]);
        }
    }
};

var genCallback = function(err, data, key){
    if(err) return console.error(err);
    !firstUpdate && displayChange(data.data, arrays[key], key);
    arrays[key] = data.data;
};

var forgetCallUpdate = function(){
    print(1, 'The chain is broken! You need to invoke "NEXT" (third argument from "callee")!');
    process.exit(1);
};
var errorInRuntime = function(err){
    print(1, 'There was an error in the "callee" runtime:\n' + err);
    process.exit(1);
};
var timer;
var update = function(){
    var cleanFn = function(){
        clearTimeout(timer);
        update();
    };
    var next = function(err){
        if(err) return errorInRuntime(err);
        var fn = stack.shift();
        if(fn && typeof fn === 'function'){
            timer = setTimeout(forgetCallUpdate, 4000);
            fn(client, arrays, cleanFn);
        }else{
            update();
        }
        if(firstUpdate) firstUpdate = false;
    };
    eval(readFunctions[0]);
};

var readFunctions = [], labels = ['coils', 'inputStatus', 'holdingReg', 'inputReg'];
var buildReadFunctions = function(){
    for(var i=4; i>0; i--){
        readFunctions[i-1] = 'client.writeFC' + i + '(' + defs.id + ',' + defs.address.init + ',' + defs.address.length +
            ', function(err, data){ genCallback(err, data, "' + labels[i-1] + '"); ' +
            ((i!=4) ? (readFunctions[i]) : ('next()')) + '; });';
    }
};

var onConnectEvent = function(err){
    if(err) {
        print(1, 'Error while trying to connect (' + err.code + '). Slave online? Trying again..');
        return tryToConnect();
    }
    print('Connection successful!');
    buildReadFunctions();
    update();
};

var tryToConnect = function(){
    client.connectTCP(defs.ip, {port: defs.port}, onConnectEvent);
    client.setID(defs.id);
};

var Obj = function(options){
    defs.debug = (options && options.debug) || false;
    defs.ip = (options && options.ip) || '127.0.0.1';
    defs.port = (options && options.port) || 502;
    defs.id = (options && options.id) || 1;
    defs.address = (options && options.address) || {init : 0, length : 10};
    tryToConnect();
    return {
        on: function (name, callback) {
            events[name] = callback;
        },
        callee : function(callback){
            stack.push(callback);
        }
    }
};
module.exports = Obj;