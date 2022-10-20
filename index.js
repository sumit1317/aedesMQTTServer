const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
MQTT_Port = 1883;
server.listen(MQTT_Port, function () {
  console.log("Aedes MQTT server started and listening on port ", MQTT_Port);
});
// authentication
aedes.authenticate = (client, username, password, callback) => {
  password = Buffer.from(password, "base64").toString();
  if (username === "hello" && password === "password1") {
    console.log("Connected Successfully");
    return callback(null, true);
  }
  const error = new Error(
    "Authentication Failed!! Please enter valid credentials."
  );
  console.log("Authentication failed.");
  return callback(error, false);
};

// emitted when a client connects to the broker
aedes.on("client", function (client) {
  console.log(
    `CLIENT_CONNECTED : MQTT Client ${
      client ? client.id : client
    } connected to aedes broker ${aedes.id}`
  );
});
// emitted when a client disconnects from the broker
aedes.on("clientDisconnect", function (client) {
  console.log(
    `CLIENT_DISCONNECTED : MQTT Client ${
      client ? client.id : client
    } disconnected from the aedes broker ${aedes.id}`
  );
});
// emitted when a client subscribes to a message topic
aedes.on("subscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_SUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } subscribed to topic: ${subscriptions
      .map((s) => s.topic)
      .join(",")} on aedes broker ${aedes.id}`
  );
});
// emitted when a client unsubscribes from a message topic
aedes.on("unsubscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_UNSUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } unsubscribed to topic: ${subscriptions.join(",")} from aedes broker ${
      aedes.id
    }`
  );
});
// emitted when a client publishes a message packet on the topic
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      `MESSAGE_PUBLISHED : MQTT Client ${
        client ? client.id : "AEDES BROKER_" + aedes.id
      } has published message "${packet.payload}" on ${
        packet.topic
      } to aedes broker ${aedes.id}`
    );
  }
});
