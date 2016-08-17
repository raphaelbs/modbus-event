# modbus-event

Modbus-event is a TCP/IP Master, event-driven, implementation for modbus protocol.

#### Please Note

This package was built upon the great [modbus-serial](https://www.npmjs.com/package/modbus-serial).
Know the [methods](https://www.npmjs.com/package/modbus-serial#methods) section to get the best out of it.

---

## Installation

```javascript
var modbusEvent = require('modbus-event');
```

---

## Usage

```javascript
// Require library
var modbusEvent = require('modbus-event');
// Set constructor options
var options = {
	debug : true, // default: false
    ip : '192.168.1.1', // default: '127.0.0.1'
    port : 777, // default: 502
    id : 2 // default: 1
};
var me = modbusEvent(options);

// Executes some function in between the reading stage
me.callee(function(client, datas, next){
    client.writeCoil(1, 1).then(next);
});

// Assign a listener event
me.on('update', function(type, address, from, to){
    console.log(type, address, from, to);
});
```

---

## Reference

### require('modbus-event')
>_return Function([options](#constructor-object-argument-options))_

Main function of [modbus-event](https://www.npmjs.com/package/modbus-event)

***

### Constructor object argument: Options

key | description | type | default
--- | --- | --- | ---
*debug* | Enable verbosity for debuggin (very handy) | boolean | false
*ip* | The listenning IP of your Slave Modbus | string | '127.0.0.1'
*port* | The listenning port of yout Slave Modbus | number | 502
*id* | The SlaveID of your Slave Modbus | number | 1
*address* | Reading address range | _Object_ { init : _initial address_, length : _address range_ } | { init : 0, length : 10 }

##### Sample:

```javascript
var options = {
	debug : true, // default: false
    ip : '192.168.1.1', // default: '127.0.0.1'
    port : 777, // default: 502
    id : 2 // default: 1
};
var me = modbusEvent(options);
```
***

### require('modbus-event')(options)
>_return Object { callee : fn, on : fn }_

The constructor of [modbus-event](https://www.npmjs.com/package/modbus-event).
Return the following objects:

key | value
--- | ---
_callee_ | function(client, data, next)
_on_ | function(event, callback)

___
#### require('modbus-event')(options)#callee
>_type Function(client, data, next)_

Executes arbitrary code when the serial channel is available. The function arguments are:

argument | description
--- | ---
_client_ | an instance of [modbus-serial](https://www.npmjs.com/package/modbus-serial)
_data_ | object containing all addresses and values
_next_ | a function that you **need to invoke** when done

___

#### require('modbus-event')(options)#on
>_type Function(event, callback)_

Assign an event and the respective callback. This are the available events:
update | function(type, address, from, to)
--- | ---
triggers when **any** register is changed | **type** is the address indentifier ('coils', 'inputStatus', 'holdingReg', 'inputReg')
&nbsp; | **address** is the changed address in the moment
&nbsp; | **from** is the value before the change
&nbsp; | **to** is the value after the change

---

## Dependencies

modbus-serial

---

## Contact-me
* [Email](mailto:raphael.b.souza@hotmail.com)
* [Facebook](https://facebook.com/raphaelbs)
* [GitHub](https://github.com/raphaelbs)
* [NPM](https://npmjs.com/~raphaelbs)

---

## License

MIT
