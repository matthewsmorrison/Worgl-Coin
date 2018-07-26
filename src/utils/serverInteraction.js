export async function callServer(data) {
	const response = await fetch('http://localhost:5000/zk-snark/compute', {
		method: "POST",
		headers:{'content-type': 'application/json'},
		body: JSON.stringify({input: data}),
	});
	console.log(JSON.stringify({input: data}));
	const body = await response.json();

	if (response.status !== 200) throw Error(body.message);

	return body;
};

export function parseServerResponse(buf) {
	let bufferArray = Buffer.from(buf);
	let bufferString = bufferArray.toString('utf8');
	let split = bufferString.split(';');

	var A = cleanResponseOnePair(split[0]);
	var A_p = cleanResponseOnePair(split[1]);
	var B = cleanResponseTwoPair(split[2]);
	var B_p = cleanResponseOnePair(split[3]);
	var C = cleanResponseOnePair(split[4]);
	var C_p = cleanResponseOnePair(split[5]);
	var H = cleanResponseOnePair(split[6]);
	var K = cleanResponseOnePair(split[7]);

	return {
		A: A,
		A_p: A_p,
		B: B,
		B_p: B_p,
		C: C,
		C_p: C_p,
		H: H,
		K: K,
	};
}

function cleanResponseOnePair(input) {
	var output;

	output = input.split('(');
	output = output[1];
	output = output.split(')');
	output = output[0];
	output = output.split(',');
	output[0] = output[0].trim().toString();
	output[1] = output[1].trim().toString();

	return output;
}

function cleanResponseTwoPair(input) {
	var output;

	output = input.split('(');
	output = output[1];
	output = output.split(')');
	output = output[0];
	output = output.split(',');
	output[0] = output[0].trim().replace(/[\[\]']+/g,'').toString();
	output[1] = output[1].trim().replace(/[\[\]']+/g,'').toString();
	output[2] = output[2].trim().replace(/[\[\]']+/g,'').toString();
	output[3] = output[3].trim().replace(/[\[\]']+/g,'').toString();
	output = [[output[0],output[1]], [output[2], output[3]]];

	return output;
}
