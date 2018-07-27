// https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
// https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a
const express = require('express');
const cors = require('cors');
const shell = require('shelljs');
const bodyParser = require("body-parser");
const child_process = require('child_process');
const spawn = require('child_process').spawn;

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/zk-snark/compute', (req, res) => {

  var output;

  console.log("Received a post request...");
  console.log("Generating zero-knowledge proof for requestor...");
  const child = spawn('docker', ['run', '-i', 'matthewsmorrison/zokrates:executable', '/bin/bash']);
  child.stdin.write("cd ZoKrates/target/release\n");
  child.stdin.write("./zokrates compute-witness -a " + req.body.input + " | tail -n 0 > computeWitness.txt\n");
  child.stdin.write("./zokrates generate-proof | tail -n 9\n");
  child.stdin.write("exit\n");
  child.stdin.end();

  child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
  output = {data};
  });

  child.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);
  });

  child.on('exit', function (code, signal) {
  console.log('child process exited with ' + `code ${code} and signal ${signal}`);
  console.log("The zero-knowledge proof has been succesfully generated.");
  console.log("Sending back the response.");
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({proofDetails: output}));
  });

});

app.listen(port, () => console.log(`Listening on port ${port}`));
