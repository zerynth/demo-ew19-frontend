const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mqtt = require('mqtt')

/* CONFIG */
const PORT = 3001;
const MQTT = 'mqtts://a2u7dlu11musg7-ats.iot.eu-central-1.amazonaws.com';
console.log(path.join(__dirname, 'certs', 'private.pem.key'))
const SSL_OPTS = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'private.pem.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'certificate.pem.crt')),
}
const TOPICS = ['ew/rs/sensors', 'ew/cypress/sensors'];
/* END CONFIG */


const mqtt_client = mqtt.connect(MQTT, SSL_OPTS)

mqtt_client.on('connect', () => {
  console.log('Connected to MQTT broker');
  TOPICS.forEach(topic => mqtt_client.subscribe(topic));
});

mqtt_client.on('message', (topic, message) => {
  // if (!TOPICS.includes(topic)) {
  //   return;
  // }
  try {
    const msg_data = JSON.parse(message);
    io.emit(topic, msg_data);
  } catch (err) {
    console.error(`Error parsing JSON: ${message}`);
  }
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
