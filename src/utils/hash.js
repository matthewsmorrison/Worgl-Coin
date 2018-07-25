import SHA256Compress from 'sha256-compression-algorithm';


export function convertAndPad(input) {
  var output;
  output = "";

  for (var i = 0; i < input.length; i++) {
      output += (input[i].charCodeAt(0).toString(2)).padStart(8,"0");
  }

  output = output.padEnd(512, "0");
  return output;
}

export function sha256compression(input) {
  var Buffer = require('buffer/').Buffer
  var buf = new Buffer(input, 'hex');
  var output = SHA256Compress(buf).toString('hex');
  return output;
}

export function binaryToHex(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return ret;
}

export function hexToBinary(compressed) {
  var returnValue = ''; // Empty string to add our data to later on.

  for (var i = 0; i < parseInt(compressed.length / 2, 10); i++) {
    // Determining the substring.
    var substring = compressed.substr(i*2, 2);
    // Determining the binValue of this hex substring.
    var binValue = parseInt(substring, 16).toString(2);

    // If the length of the binary value is not equal to 8 we add leading 0s (js deletes the leading 0s)
    // For instance the binary number 00011110 is equal to the hex number 1e,
    // but simply running the code above will return 11110. So we have to add the leading 0s back.
    if (binValue.length !== 8) {
      // Determining how many 0s to add:
      var diffrence = 8 - binValue.length;

      // Adding the 0s:
      for (var j = 0; j < diffrence; j++) {
        binValue = '0'+binValue;
      }
    }

    // Adding the binValue to the end string which we will return.
    returnValue += binValue
    }
    // Returning the decompressed string.
    return returnValue;
}
