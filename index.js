// const aedes = require("aedes")();
// const server = require("net").createServer(aedes.handle);
// MQTT_Port = 1883;
// server.listen(MQTT_Port, function () {
//   console.log("Aedes MQTT server started and listening on port ", MQTT_Port);
// });
// // authentication
// aedes.authenticate = (client, username, password, callback) => {
//   password = Buffer.from(password, "base64").toString();
//   if (username === "hello" && password === "password1") {
//     console.log("Connected Successfully");
//     return callback(null, true);
//   }
//   const error = new Error(
//     "Authentication Failed!! Please enter valid credentials."
//   );
//   console.log("Authentication failed.");
//   return callback(error, false);
// };

// // emitted when a client connects to the broker
// aedes.on("client", function (client) {
//   console.log(
//     `CLIENT_CONNECTED : MQTT Client ${
//       client ? client.id : client
//     } connected to aedes broker ${aedes.id}`
//   );
// });
// // emitted when a client disconnects from the broker
// aedes.on("clientDisconnect", function (client) {
//   console.log(
//     `CLIENT_DISCONNECTED : MQTT Client ${
//       client ? client.id : client
//     } disconnected from the aedes broker ${aedes.id}`
//   );
// });
// // emitted when a client subscribes to a message topic
// aedes.on("subscribe", function (subscriptions, client) {
//   console.log(
//     `TOPIC_SUBSCRIBED : MQTT Client ${
//       client ? client.id : client
//     } subscribed to topic: ${subscriptions
//       .map((s) => s.topic)
//       .join(",")} on aedes broker ${aedes.id}`
//   );
// });
// // emitted when a client unsubscribes from a message topic
// aedes.on("unsubscribe", function (subscriptions, client) {
//   console.log(
//     `TOPIC_UNSUBSCRIBED : MQTT Client ${
//       client ? client.id : client
//     } unsubscribed to topic: ${subscriptions.join(",")} from aedes broker ${
//       aedes.id
//     }`
//   );
// });
// // emitted when a client publishes a message packet on the topic
// aedes.on("publish", function (packet, client) {
//   if (client) {
//     console.log(
//       `MESSAGE_PUBLISHED : MQTT Client ${
//         client ? client.id : "AEDES BROKER_" + aedes.id
//       } has published message "${packet.payload}" on ${
//         packet.topic
//       } to aedes broker ${aedes.id}`
//     );
//   }
// });

const cluster = require("cluster");
const mqemitter = require("mqemitter-mongodb");
const mongoPersistence = require("aedes-persistence-mongodb");

//const MONGO_URL = 'mongodb://127.0.0.1/aedes-clusters'
const MONGO_URL =
  "";

function startAedes() {
  const port = 1883;

  const aedes = require("aedes")({
    id: "BROKER_" + cluster.worker.id,
    mq: mqemitter({
      url: MONGO_URL,
    }),
    persistence: mongoPersistence({
      url: MONGO_URL,
      // Optional ttl settings
      ttl: {
        packets: 300, // Number of seconds
        subscriptions: 300,
      },
    }),
  });

  const server = require("net").createServer(aedes.handle);

  server.listen(port, function () {
    console.log("Aedes listening on port:", port);
    // aedes.publish({ topic: "aedes/hello", payload: "I'm broker " + aedes.id });
  });

  aedes.on("subscribe", function (subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m subscribed to topics: " +
        subscriptions.map((s) => s.topic).join("\n"),
      "from broker",
      aedes.id
    );
  });

  aedes.on("unsubscribe", function (subscriptions, client) {
    console.log(
      "MQTT client \x1b[32m" +
        (client ? client.id : client) +
        "\x1b[0m unsubscribed to topics: " +
        subscriptions.join("\n"),
      "from broker",
      aedes.id
    );
  });

  // fired when a client connects
  aedes.on("client", function (client) {
    console.log(
      "Client Connected: \x1b[33m" + (client ? client.id : client) + "\x1b[0m",
      "to broker",
      aedes.id
    );
  });

  // fired when a client disconnects
  aedes.on("clientDisconnect", function (client) {
    console.log(
      "Client Disconnected: \x1b[31m" +
        (client ? client.id : client) +
        "\x1b[0m",
      "to broker",
      aedes.id
    );
  });

  // fired when a message is published
  aedes.on("publish", async function (packet, client) {
    console.log(
      "Client \x1b[31m" +
        (client ? client.id : "BROKER_" + aedes.id) +
        "\x1b[0m has published",
      packet.payload.toString(),
      "on",
      packet.topic,
      "to broker",
      aedes.id
    );
  });
}

// if (cluster.isMaster) {
//   const numWorkers = require("os").cpus().length;
//   for (let i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }

//   cluster.on("online", function (worker) {
//     console.log("Worker " + worker.process.pid + " is online");
//   });

//   cluster.on("exit", function (worker, code, signal) {
//     console.log(
//       "Worker " +
//         worker.process.pid +
//         " died with code: " +
//         code +
//         ", and signal: " +
//         signal
//     );
//     console.log("Starting a new worker");
//     cluster.fork();
//   });
// } else {
  startAedes();
//}
