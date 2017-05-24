# modbus-event

Modbus-event is a TCP/IP Master, event-driven, implementation for modbus protocol.
This package was built upon the great [modbus-serial](https://www.npmjs.com/package/modbus-serial).
Make sure to read the [methods](https://www.npmjs.com/package/modbus-serial#methods) section to get the best out this module.

## Installation

```bash
npm i -S modbus-event
```

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
me.run(function(client, datas, next){
    client.writeCoil(1, 1).then(next);
});

// Assign a listener event
me.on('update', function(type, address, newValue, oldValue){
    console.log(type, address, newValue, oldValue);
});
```

## Reference

#### require('modbus-event')
>_return Function([options](#constructor-object-argument-options))_

Main function of [modbus-event](https://www.npmjs.com/package/modbus-event)

#### Constructor argument: Options

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

#### require('modbus-event')(options)
>_return Object { run : fn, on : fn }_

The constructor of [modbus-event](https://www.npmjs.com/package/modbus-event).
Return the following functions:

key | value
--- | ---
_run_ | function(client, data, next)
_on_ | function(event, callback)

#### require('modbus-event')(options)#run
>_type Function(client, data, next)_

Executes arbitrary code when the serial channel is available. The function arguments are:

argument | description
--- | ---
_client_ | an instance of [modbus-serial](https://www.npmjs.com/package/modbus-serial)
_data_ | object containing all addresses and values
_next_ | a function that you **need to invoke** when done

#### require('modbus-event')(options)#on
>_type Function(event, callback)_

Assign an event and the respective callback. This are the available events:

update | function(type, address, newValue, oldValue)
--- | ---
triggers when **any** register is changed | **type** is the address indentifier ('coils', 'inputStatus', 'holdingReg', 'inputReg')
&nbsp; | **address** is the changed address in the moment
&nbsp; | **newValue** is the value before the update
&nbsp; | **oldValue** is the value after the update

## Dependencies

[modbus-serial](https://www.npmjs.com/package/modbus-serial)

## Contact-me
* [Email](mailto:raphael.b.souza@hotmail.com)
* [Facebook](https://facebook.com/raphaelbs)
* [GitHub](https://github.com/raphaelbs)
* [NPM](https://npmjs.com/~raphaelbs)

## License

MIT
