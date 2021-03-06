// Current bug with Scratch link needs to be fixed before this code can be tested
// https://scratch.mit.edu/discuss/topic/419098/?page=1#post-4183792
// https://github.com/LLK/scratchx/wiki#writing-extensions-for-scratchx
(function (ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function () { };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return { status: 2, msg: 'Ready' };
    };

    // send bluetooth command to klaatubot
    ext.send_cmd = function (cmd) {
        console.log("send_cmd:" + cmd);
        //initBT();
    };

    // send bluetooth command to klaatubot
    ext.send_cmds = function (cmd, val1, val2) {
        //console.log("send_cmds:" + cmd + "," + val1 + "," + val2);
        cmdStr = "";
        switch (cmd) {
            case 'Servo 0':
                cmdStr = ext.e_cmd(val1, val2);
                break;
            case 'Servo 1':
                    cmdStr = ext.f_cmd(val1, val2);
                break;
            case 'Servo 2':
                    cmdStr = ext.g_cmd(val1, val2);
                break;
            case 'Digital Output 3':
                    cmdStr = ext.h_cmd(val1, val2);
                break;
            case 'Digital Output 4':
                    cmdStr = ext.i_cmd(val1, val2);
                break;
            case 'Digital Output 5':
                    cmdStr = ext.j_cmd(val1, val2);
                break;
            case 'Stop All Motors':
                    cmdStr = ext.l_cmd(val1, val2);
                break;
            case 'Read A/D Inputs':
                    cmdStr = ext.m_cmd(val1, val2);
                break;
            default:
            // code block
        }
        console.log("send_cmds:" + cmdStr)
        return cmdStr;
        //initBT();
    };

    // e command string
    ext.e_cmd = function (val1, val2) {
        cmdStr = "e" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // f command string
    ext.f_cmd = function (val1, val2) {
        cmdStr = "f" + val1 + "," + val2 + ","
        return cmdStr;
    };

    // g command string
    ext.g_cmd = function (val1, val2) {
        cmdStr = "g" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // h command string
    ext.h_cmd = function (val1, val2) {
        cmdStr = "h" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // i command string
    ext.i_cmd = function (val1, val2) {
        cmdStr = "i" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // j command string
    ext.j_cmd = function (val1, val2) {
        cmdStr = "j" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // l command string
    ext.l_cmd = function (val1, val2) {
        cmdStr = "l" + val1 + "," + val2 + ",";
        return cmdStr;
    };

    // l command string
    ext.m_cmd = function () {
        cmdStr = "m0,0,";
        return cmdStr;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'Klaatubot Send Cmd %s', 'send_cmd', ''],
            [' ', 'Klaatubot Send Command %m.commands %s,%s', 'send_cmds', 'Servo 0', '0', '0'],
            // Block type, block name, function name, param1 default value, param2 default value
            ['r', 'Servo 0%s,%s,', 'e_cmd', '0', '0'],
            ['r', 'Servo 1%s,%s,', 'f_cmd', '0', '0'],
            ['r', 'Servo 2%s,%s,', 'g_cmd', '0', '0'],
            ['r', 'Digital Output 3%s,%s,', 'h_cmd', '0', '0'],
            ['r', 'Digital Output 4%s,%s,', 'i_cmd', '0', '0'],
            ['r', 'Digital Output 5%s,%s,', 'j_cmd', '0', '0'],
            ['r', 'Stop All Motors%s,%s,', 'l_cmd', '0', '0'],
            ['r', 'Read A/D Inputs', 'm_cmd']
        ],
        menus: {
            commands: ['Servo 0', 'Servo 1', 'Servo 2', 'Digital Output 3', 'Digital Output 4', 'Digital Output 5', 'Stop All Motors', 'Read A/D Inputs']
        },
        displayName: 'Klaatubot 1.0'
    };

    // Register the extension
    ScratchExtensions.register('klaatubotExt', descriptor, ext);
})({});

//scratch link code from scratchx.org playground.html example connectDevice
class JSONRPC {
    constructor() {
        this._requestID = 0;
        this._openRequests = {};
    }

    /**
     * Make an RPC Request and retrieve the result.
     * @param {string} method - the remote method to call
     * @param {object} params - the parameters to pass to the remote method
     * @returns {Promise} - a promise for the result of the call
     */
    sendRemoteRequest(method, params) {
        const requestID = this._requestID++;

        const promise = new Promise((resolve, reject) => {
            this._openRequests[requestID] = { resolve, reject };
        });

        this._sendRequest(method, params, requestID);

        return promise;
    }

    /**
     * Make an RPC Notification with no expectation of a result or callback.
     * @param {string} method - the remote method to call
     * @param {object} params - the parameters to pass to the remote method
     */
    sendRemoteNotification(method, params) {
        this._sendRequest(method, params);
    }

    /**
     * Handle an RPC request from remote.
     * @param {string} method - the method requested by the remote caller
     * @param {object} params - the parameters sent with the remote caller's request
     * @returns a result or Promise for result, if appropriate.
     */
    didReceiveCall(method, params) {
        throw new Error("Must override didReceiveCall");
    }

    /**
     * Send a JSON-style message object over the transport.
     * @param {object} jsonMessageObject - the message to send
     * @private
     */
    _sendMessage(jsonMessageObject) {
        throw new Error("Must override _sendMessage");
    }

    _sendRequest(method, params, id) {
        const request = {
            jsonrpc: "2.0",
            method,
            params
        };

        if (id != null) {
            request.id = id;
        }

        this._sendMessage(request);
    }

    _handleMessage(json) {
        if (json.jsonrpc !== '2.0') {
            throw new Error(`Bad or missing JSON-RPC version in message: ${stringify(json)}`);
        }
        if (json.hasOwnProperty('method')) {
            this._handleRequest(json);
        } else {
            this._handleResponse(json);
        }
    }

    _sendResponse(id, result, error) {
        const response = {
            jsonrpc: '2.0',
            id
        };
        if (error != null) {
            response.error = error;
        } else {
            response.result = result || null;
        }
        this._sendMessage(response);
    }

    _handleResponse(json) {
        const { result, error, id } = json;
        const openRequest = this._openRequests[id];
        delete this._openRequests[id];
        if (error) {
            openRequest.reject(error);
        } else {
            openRequest.resolve(result);
        }
    }

    _handleRequest(json) {
        const { method, params, id } = json;
        const rawResult = this.didReceiveCall(method, params);
        if (id != null) {
            Promise.resolve(rawResult).then(
                result => {
                    this._sendResponse(id, result);
                },
                error => {
                    this._sendResponse(id, null, error);
                }
            );
        }
    }
}

class JSONRPCWebSocket extends JSONRPC {
    constructor(webSocket) {
        super();

        this._ws = webSocket;
        this._ws.onmessage = e => this._onSocketMessage(e);
        this._ws.onopen = e => this._onSocketOpen(e);
        this._ws.onclose = e => this._onSocketClose(e);
        this._ws.onerror = e => this._onSocketError(e);
    }

    dispose() {
        this._ws.close();
        this._ws = null;
    }

    _onSocketOpen(e) {
        addLine(`WS opened: ${stringify(e)}`);
    }

    _onSocketClose(e) {
        addLine(`WS closed: ${stringify(e)}`);
    }

    _onSocketError(e) {
        addLine(`WS error: ${stringify(e)}`);
    }

    _onSocketMessage(e) {
        addLine(`Received message: ${e.data}`);
        const json = JSON.parse(e.data);
        this._handleMessage(json);
    }

    _sendMessage(message) {
        const messageText = JSON.stringify(message);
        addLine(`Sending message: ${messageText}`);
        this._ws.send(messageText);
    }
}

class ScratchBLE extends JSONRPCWebSocket {
    constructor() {
        super(new WebSocket('wss://device-manager.scratch.mit.edu:20110/scratch/ble'));

        this.discoveredPeripheralId = null;
    }

    requestDevice(options) {
        return this.sendRemoteRequest('discover', options);
    }

    didReceiveCall(method, params) {
        switch (method) {
            case 'didDiscoverPeripheral':
                addLine(`Peripheral discovered: ${stringify(params)}`);
                this.discoveredPeripheralId = params['peripheralId'];
                break;
            case 'ping':
                return 42;
        }
    }

    read(serviceId, characteristicId, optStartNotifications = false) {
        const params = {
            serviceId,
            characteristicId
        };
        if (optStartNotifications) {
            params.startNotifications = true;
        }
        return this.sendRemoteRequest('read', params);
    }

    write(serviceId, characteristicId, message, encoding = null, withResponse = null) {
        const params = { serviceId, characteristicId, message };
        if (encoding) {
            params.encoding = encoding;
        }
        if (withResponse !== null) {
            params.withResponse = withResponse;
        }
        return this.sendRemoteRequest('write', params);
    }
}

class ScratchBT extends JSONRPCWebSocket {
    constructor() {
        super(new WebSocket('wss://device-manager.scratch.mit.edu:20110/scratch/bt'));
    }

    requestDevice(options) {
        return this.sendRemoteRequest('discover', options);
    }

    connectDevice(options) {
        return this.sendRemoteRequest('connect', options);
    }

    sendMessage(options) {
        return this.sendRemoteRequest('send', options);
    }

    didReceiveCall(method, params) {
        switch (method) {
            case 'didDiscoverPeripheral':
                addLine(`Peripheral discovered: ${stringify(params)}`);
                break;
            case 'didReceiveMessage':
                addLine(`Message received from peripheral: ${stringify(params)}`);
                break;
            default:
                return 'nah';
        }
    }
}

self.Scratch = self.Scratch || {};

// function attachFunctionToButton(buttonId, func) {
//     const button = document.getElementById(buttonId);
//     button.onclick = () => {
//         try {
//             func();
//         } catch (e) {
//             addLine(`Button ${buttonId} caught exception: ${stringify(e)})`);
//         }
//     }
// }

function getVersion(session) {
    session.sendRemoteRequest('getVersion').then(
        x => {
            addLine(`Version request resolved with: ${stringify(x)}`);
        },
        e => {
            addLine(`Version request rejected with: ${stringify(e)}`);
        }
    );
}

function initBLE() {
    addLine('Connecting...');
    self.Scratch.BLE = new ScratchBLE();
    addLine('Connected.');
}

function pingBLE() {
    Scratch.BLE.sendRemoteRequest('pingMe').then(
        x => {
            addLine(`Ping request resolved with: ${stringify(x)}`);
        },
        e => {
            addLine(`Ping request rejected with: ${stringify(e)}`);
        }
    );
}

const filterInputsBLE = [];
//TODO
function addFilterBLE() {
    // const filter = {};
    // filterInputsBLE.push(filter);
    //
    // const fieldset = document.createElement('fieldset');
    //
    // const legend = document.createElement('legend');
    // legend.appendChild(document.createTextNode('Filter ' + filterInputsBLE.length));
    // fieldset.appendChild(legend);
    //
    // const exactNameDiv = document.createElement('div');
    // exactNameDiv.appendChild(document.createTextNode('Discover peripherals with exact name: '));
    // const exactNameInput = document.createElement('input');
    // exactNameInput.type = 'text';
    // exactNameInput.placeholder = 'Name';
    // exactNameDiv.appendChild(exactNameInput);
    // fieldset.appendChild(exactNameDiv);
    //
    // const namePrefixDiv = document.createElement('div');
    // namePrefixDiv.appendChild(document.createTextNode('Discover peripherals with name prefix: '));
    // const namePrefixInput = document.createElement('input');
    // namePrefixInput.type = 'text';
    // namePrefixInput.placeholder = 'Name Prefix';
    // namePrefixDiv.appendChild(namePrefixInput);
    // fieldset.appendChild(namePrefixDiv);
    //
    // const servicesDiv = document.createElement('div');
    // servicesDiv.appendChild(document.createTextNode('Discover peripherals with these services:'));
    // servicesDiv.appendChild(document.createElement('br'));
    // const servicesInput = document.createElement('textarea');
    // servicesInput.placeholder = 'Required services, if any, separated by whitespace';
    // servicesInput.style = 'width:20rem;height:3rem;';
    // servicesDiv.appendChild(servicesInput);
    // fieldset.appendChild(servicesDiv);
    //
    // const manufacturerDataDiv = document.createElement('div');
    // manufacturerDataDiv.appendChild(document.createTextNode('Discover peripherals with this manufacturer data:'));
    // manufacturerDataDiv.appendChild(document.createElement('br'));
    // const addManufacturerDataFilterButton = document.createElement('button');
    // addManufacturerDataFilterButton.appendChild(document.createTextNode('Add data filter'));
    // const manufacturerDataFilterInputs = [];
    // addManufacturerDataFilterButton.onclick = () => {
    //     const manufacturerDataFilter = {};
    //     manufacturerDataFilterInputs.push(manufacturerDataFilter);
    //     const manufacturerDataFilterFields = document.createElement('fieldset');
    //     const manufacturerDataFilterLegend = document.createElement('legend');
    //     manufacturerDataFilterLegend.appendChild(document.createTextNode('Manufacturer Data Filter ' + manufacturerDataFilterInputs.length));
    //     manufacturerDataFilterFields.appendChild(manufacturerDataFilterLegend);
    //
    //     const manufacturerIdDiv = document.createElement('div');
    //     manufacturerIdDiv.appendChild(document.createTextNode('Manufacturer ID: '));
    //     const manufacturerIdInput = document.createElement('input');
    //     manufacturerIdInput.type = 'number';
    //     manufacturerIdInput.placeholder = '65535';
    //     manufacturerIdDiv.appendChild(manufacturerIdInput);
    //     manufacturerDataFilterFields.appendChild(manufacturerIdDiv);
    //
    //     const manufacturerDataPrefixDiv = document.createElement('div');
    //     manufacturerDataPrefixDiv.appendChild(document.createTextNode('Data Prefix: '));
    //     manufacturerDataPrefixInput = document.createElement('input');
    //     manufacturerDataPrefixInput.type = 'text';
    //     manufacturerDataPrefixInput.placeholder = '1 2 3';
    //     manufacturerDataPrefixDiv.appendChild(manufacturerDataPrefixInput);
    //     manufacturerDataFilterFields.appendChild(manufacturerDataPrefixDiv);
    //
    //     const manufacturerDataMaskDiv = document.createElement('div');
    //     manufacturerDataMaskDiv.appendChild(document.createTextNode('Mask: '));
    //     manufacturerDataMaskInput = document.createElement('input');
    //     manufacturerDataMaskInput.type = 'text';
    //     manufacturerDataMaskInput.placeholder = '255 15 255';
    //     manufacturerDataMaskDiv.appendChild(manufacturerDataMaskInput);
    //     manufacturerDataFilterFields.appendChild(manufacturerDataMaskDiv);
    //
    //     manufacturerDataFilter.idInput = manufacturerIdInput;
    //     manufacturerDataFilter.prefixInput = manufacturerDataPrefixInput;
    //     manufacturerDataFilter.maskInput = manufacturerDataMaskInput;
    //
    //     manufacturerDataDiv.appendChild(manufacturerDataFilterFields);
    // };
    // manufacturerDataDiv.appendChild(addManufacturerDataFilterButton);
    // fieldset.appendChild(manufacturerDataDiv);
    //
    // filter.exactNameInput = exactNameInput;
    // filter.namePrefixInput = namePrefixInput;
    // filter.servicesInput = servicesInput;
    // filter.manufacturerDataFilterInputs = manufacturerDataFilterInputs;
    //
    // const filtersParent = document.getElementById('filtersBLE');
    // filtersParent.appendChild(fieldset);
}

function discoverBLE() {
    const filters = [];
    for (const filterInputs of filterInputsBLE) {
        const filter = {};
        if (filterInputs.exactNameInput.value) filter.name = filterInputs.exactNameInput.value;
        if (filterInputs.namePrefixInput.value) filter.namePrefix = filterInputs.namePrefixInput.value;
        if (filterInputs.servicesInput.value.trim()) filter.services = filterInputs.servicesInput.value.trim().split(/\s+/);
        if (filter.services) filter.services = filter.services.map(s => parseInt(s));

        let hasManufacturerDataFilters = false;
        const manufacturerDataFilters = {};
        for (manufacturerDataFilterInputs of filterInputs.manufacturerDataFilterInputs) {
            if (!manufacturerDataFilterInputs.idInput.value) continue;
            const id = manufacturerDataFilterInputs.idInput.value.trim();
            const manufacturerDataFilter = {};
            manufacturerDataFilters[id] = manufacturerDataFilter;
            hasManufacturerDataFilters = true;
            if (manufacturerDataFilterInputs.prefixInput.value) manufacturerDataFilter.dataPrefix = manufacturerDataFilterInputs.prefixInput.value.trim().split(/\s+/).map(p => parseInt(p));
            if (manufacturerDataFilterInputs.maskInput.value) manufacturerDataFilter.mask = manufacturerDataFilterInputs.maskInput.value.trim().split(/\s+/).map(m => parseInt(m));
        }
        if (hasManufacturerDataFilters) {
            filter.manufacturerData = manufacturerDataFilters;
        }
        filters.push(filter);
    }

    const deviceDetails = {
        filters: filters
    };

    const optionalServicesBLE = document.getElementById('optionalServicesBLE');
    if (optionalServicesBLE.value.trim()) deviceDetails.optionalServices = optionalServicesBLE.value.trim().split(/\s+/);

    Scratch.BLE.requestDevice(
        deviceDetails
    ).then(
        x => {
            addLine(`requestDevice resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`requestDevice rejected with: ${stringify(e)}`);
        }
    );
}

function connectBLE() {
    // this should really be implicit in `requestDevice` but splitting it out helps with debugging
    Scratch.BLE.sendRemoteRequest(
        'connect',
        { peripheralId: Scratch.BLE.discoveredPeripheralId }
    ).then(
        x => {
            addLine(`connect resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`connect rejected with: ${stringify(e)}`);
        }
    );
}

function getServicesBLE() {
    Scratch.BLE.sendRemoteRequest(
        'getServices'
    ).then(
        x => {
            addLine(`getServices resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`getServices rejected with: ${stringify(e)}`);
        }
    );
}

// function setServiceMicroBit() {
//     document.getElementById('serviceBLE').value = '0xf005';
// }

// function readMicroBit() {
//     Scratch.BLE.read(0xf005, '5261da01-fa7e-42ab-850b-7c80220097cc', true).then(
//         x => {
//             addLine(`read resolved to: ${stringify(x)}`);
//         },
//         e => {
//             addLine(`read rejected with: ${stringify(e)}`);
//         }
//     );
// }

// function writeMicroBit() {
//     const message = _encodeMessage('LINK');
//     Scratch.BLE.write(0xf005, '5261da02-fa7e-42ab-850b-7c80220097cc', message, 'base64').then(
//         x => {
//             addLine(`write resolved to: ${stringify(x)}`);
//         },
//         e => {
//             addLine(`write rejected with: ${stringify(e)}`);
//         }
//     );
// }

// function setServiceWeDo2() {
//     document.getElementById('serviceBLE').value = '00001523-1212-efde-1523-785feabcd123';
// }

// function setGDXFOR() {
//     if (filtersBLE.length < 1) addFilterBLE();
//     const optionalServicesBLE = document.getElementById('optionalServicesBLE');
//     optionalServicesBLE.value = 'd91714ef-28b9-4f91-ba16-f0d9a604f112';
//     filterInputsBLE[0].namePrefixInput.value = 'GDX';
//     filterInputsBLE[0].exactNameInput.value = null;
//     filterInputsBLE[0].servicesInput.value = null;
// }

// micro:bit base64 encoding
// https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
function _encodeMessage(message) {
    const output = new Uint8Array(message.length);
    for (let i = 0; i < message.length; i++) {
        output[i] = message.charCodeAt(i);
    }
    const output2 = new Uint8Array(output.length + 1);
    output2[0] = 0x81; // CMD_DISPLAY_TEXT
    for (let i = 0; i < output.length; i++) {
        output2[i + 1] = output[i];
    }
    return base64 = window.btoa(String.fromCharCode.apply(null, output2));
}

// attachFunctionToButton('initBLE', initBLE);
// attachFunctionToButton('getVersionBLE', () => getVersion(self.Scratch.BLE));
// attachFunctionToButton('pingBLE', pingBLE);
// attachFunctionToButton('discoverBLE', discoverBLE);
// attachFunctionToButton('connectBLE', connectBLE);
// attachFunctionToButton('getServicesBLE', getServicesBLE);
//
// attachFunctionToButton('setServiceMicroBit', setServiceMicroBit);
// attachFunctionToButton('readMicroBit', readMicroBit);
// attachFunctionToButton('writeMicroBit', writeMicroBit);
//
// attachFunctionToButton('setServiceWeDo2', setServiceWeDo2);
//
// attachFunctionToButton('setGDXFOR', setGDXFOR);
//
// attachFunctionToButton('addFilterBLE', addFilterBLE);
//
// addFilterBLE();

function initBT() {
    addLine('Connecting...');
    self.Scratch.BT = new ScratchBT();
    addLine('Connected.');
}

function discoverBT() {
    Scratch.BT.requestDevice({
        majorDeviceClass: 8,
        minorDeviceClass: 1
    }).then(
        x => {
            addLine(`requestDevice resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`requestDevice rejected with: ${stringify(e)}`);
        }
    );
}

function connectBT() {
    Scratch.BT.connectDevice({
        peripheralId: "xyz",//document.getElementById('peripheralId').value,
        pin: "1234"
    }).then(
        x => {
            addLine(`connectDevice resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`connectDevice rejected with: ${stringify(e)}`);
        }
    );
}

function sendMessage(message) {
    Scratch.BT.sendMessage({
        message: message,
        encoding: 'base64'
    }).then(
        x => {
            addLine(`sendMessage resolved to: ${stringify(x)}`);
        },
        e => {
            addLine(`sendMessage rejected with: ${stringify(e)}`);
        }
    );
}

// function beep() {
//     Scratch.BT.sendMessage({
//         message: 'DwAAAIAAAJQBgQKC6AOC6AM=',
//         encoding: 'base64'
//     }).then(
//         x => {
//             addLine(`sendMessage resolved to: ${stringify(x)}`);
//         },
//         e => {
//             addLine(`sendMessage rejected with: ${stringify(e)}`);
//         }
//     );
// }

function stringify(o) {
    return JSON.stringify(o, o && Object.getOwnPropertyNames(o));
}

// const follow = document.getElementById('follow');
// const log = document.getElementById('log');
//
// const closeButton = document.getElementById('closeBT');
// closeButton.onclick = () => {
//     self.Scratch.BT.dispose();
// };
//
// attachFunctionToButton('initBT', initBT);
// attachFunctionToButton('getVersionBT', () => getVersion(self.Scratch.BT));
// attachFunctionToButton('discoverBT', discoverBT);
// attachFunctionToButton('connectBT', connectBT);
// attachFunctionToButton('send', sendMessage);
// attachFunctionToButton('beep', beep);

class LogDisplay {
    constructor(logElement, lineCount = 256) {
        this._logElement = logElement;
        this._lineCount = lineCount;
        this._lines = [];
        this._dirty = false;
        this._follow = true;
    }

    addLine(text) {
        this._lines.push(text);
        if (!this._dirty) {
            this._dirty = true;
            requestAnimationFrame(() => {
                this._trim();
                this._logElement.textContent = this._lines.join('\n');
                if (this._follow) {
                    this._logElement.scrollTop = this._logElement.scrollHeight;
                }
                this._dirty = false;
            });
        }
    }

    _trim() {
        this._lines = this._lines.splice(-this._lineCount);
    }
}

//const logDisplay = new LogDisplay(log);
function addLine(text) {
    // logDisplay.addLine(text);
    // logDisplay._follow = follow.checked;
    console.log(text)
}
