CF.userMain = function() {
	// This is where we tell the code what feedback we want to process
	CF.watch(CF.FeedbackMatchedEvent, "KRELL", "KRELL_FB", function(fbName, data) {
		// Ensure we have enough data
		if (data.length < 4) return;

		// Ensure data begins with \x52 for byte positioning purposes
		if (data.charCodeAt(0) != 82) data = "\x52" + data;

		// Log the output of all incoming data in a readable format
		CF.log(makeReadable(data));

		// The 'data' variable will contain all the data captured by the feedback as defined in your System, via System Manager
		var byte4 = data.charCodeAt(3); // Get the 4th byte, 0-based (starts at 0)
		var powerState = (byte4 & 1 != 0); // "AND" with 1 (binary 00000001)
		var byte4bit2 = (byte4 & 2 ? 1 : 0);
		var byte4bit3 = (byte4 & 4 ? 1 : 0);
		var byte4bit4 = (byte4 & 8 ? 1 : 0);
		var byte4bit5 = (byte4 & 16 ? 1 : 0);
		var byte4bit6 = (byte4 & 32 ? 1 : 0);
		var byte4bit7 = (byte4 & 64 ? 1 : 0);
		var byte4bit8 = (byte4 & 128 ? 1 : 0);

		var volumeLevel = data.charCodeAt(12) // Get the 13th byte, 0-based. This will always be in range 0-151 decimal (\x00 to \x97)
		CF.log("Power: " + powerState);
		CF.log("Volume: " + volumeLevel);

		CF.setJoin("d10", powerState);			// Set button state based on the power state, for button on digital join 10.
		CF.setJoin("a2", (65535/151) * volumeLevel);	// Adjust slider on join 2 to show volume level, range 0-151 decimal.
								// Sliders have a range of 0-65535, so we have to convert the value from volume range (0-151) first
	});
};

function makeReadable(bytes) {
    var readable = "", i;
    for (i = 0; i < bytes.length; i++) {
        var byteVal = bytes.charCodeAt(i);
        if (byteVal < 32 || byteVal > 127) {
            readable += "\\x" + ("0" + byteVal.toString(16).toUpperCase()).slice(-2);
        } else {
            readable += bytes[i];
        }
    }
    return readable;
}
