(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // send bluetooth command to klaatubot
    ext.send_cmd = function(cmd) {
            console.log("send_cmd:" + cmd)
        };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          // Block type, block name, function name
          [' ', 'Klaatubot Send Cmd %s', 'send_cmd', 'e0,0,'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('klaatubotExt', descriptor, ext);
})({});
